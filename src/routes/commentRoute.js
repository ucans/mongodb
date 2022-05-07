const { Router } = require('express');
// blogIdx 가져올 수 있음
const commentRoute = Router({ mergeParams: true });
const { Blog, User, Comment } = require('../models');
const mongoose = require('mongoose');
const res = require('express/lib/response');
const req = require('express/lib/request');

/**
 * /user
 * /blog
 * /blog/:blogIdx/comment
 */

// /blog/:blogIdx/comment
commentRoute.post('/', async (req, res) => {
    try {
        const { content, userIdx } = req.body;
        const { blogIdx } = req.params;
        if (content && typeof content !== 'string') return res.status(400).send({ err: 'content type should be stirng!' });
        if (!content.trim().length) return res.status(400).send({ err: 'content should be not empty!' });
        if (!mongoose.isValidObjectId(userIdx)) return res.status(400).send({ err: 'invalid user.' });
        if (!mongoose.isValidObjectId(blogIdx)) return res.status(400).send({ err: 'invalid blog' });

        // user doc 받아옴.
        // let user = await User.findById(userIdx);
        // blog doc 받아옴.
        // let blog = await Blog.findById(blogIdx);

        // 병렬처리
        const [user, blog] = await Promise.all([User.findById(userIdx), Blog.findById(blogIdx)]);
        if (!user) return res.status(400).send({ err: 'the user not exists.' });
        if (!blog) return res.status(400).send({ err: 'the blogIdx Blog not exists.' });
        if (!blog.islive) return res.status(405).send({ err: 'the blog is not live.' });

        // 저장할 때는 user/blog doc에 있는 _id를 참조 저장.
        const comment = new Comment({ content, user, userFullName: `${user.name.first} ${user.name.last}`, blog });
        // push : 배열 push
        await Promise.all([comment.save(), Blog.updateOne({ _id: blogIdx }, { $push: { comments: comment } })]);
        return res.send({ comment });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ ErrorType: err.name, ErrorMessage: err.message });
    }
});

commentRoute.get('/', async (req, res) => {
    try {
        const { blogIdx } = req.params;
        let comments = await Comment.find({ blog: blogIdx });

        // comments = await Promise.all(
        //     comments.map((comment) => {
        //         return Promise.all([User.findById(comment.user), Blog.findById(comment.blog)]) //
        //             .then((object) => {
        //                 [comment.user, comment.blog] = object;
        //                 return comment;
        //             });
        //     })
        // );

        return res.send({ comments });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ ErrorType: err.name, ErrorMessage: err.message });
    }
});

commentRoute.get('/:commentIdx', async (req, res) => {
    try {
        const { commentIdx } = req.params;
        if (!mongoose.isValidObjectId(commentIdx)) return res.status(400).send({ err: 'invalid comment' });
        const comment = await Comment.findById(commentIdx);
        return res.send(comment);
    } catch (error) {
        console.log({ error });
        res.status(500).send({ error: error.message });
    }
});

commentRoute.patch('/:commentIdx', async (req, res) => {
    try {
        const { commentIdx } = req.params;
        const { content } = req.body;
        if (!mongoose.isValidObjectId(commentIdx)) return res.status(400).send({ err: 'invalid commentIdx' });
        if (typeof content !== 'string') return res.status(400).send({ err: '' });

        const [comment] = await Promise.all([
            Comment.findByIdAndUpdate(commentIdx, { content }, { new: true }),
            // 중요 문법!!
            Blog.updateOne({ 'comments._id': commentIdx }, { 'comments.$.content': content }),
        ]);

        return res.send({ comment });
    } catch (error) {
        console.log({ error });
        res.status(500).send({ error });
    }
});

commentRoute.delete('/:commentIdx', async (req, res) => {
    try {
        const { commentIdx } = req.params;
        if (!mongoose.isValidObjectId(commentIdx)) return res.status(400).send({ err: 'invalid commentd' });
        const comment = await Comment.findByIdAndDelete(commentIdx);
        // $pull : 배열 pop
        await Blog.updateOne({ '$comments._id': commentIdx }, { $pull: { comments: { _id: commentIdx } } });
        return res.send({ comment });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ err });
    }
});

module.exports = { commentRoute };
