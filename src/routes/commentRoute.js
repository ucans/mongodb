const { Router } = require('express');
// blogIdx 가져올 수 있음
const commentRoute = Router({ mergeParams: true });
const { Blog, User, Comment } = require('../models');
const mongoose = require('mongoose');

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
        const comment = new Comment({ content, user, blog });
        await comment.save();
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

        // todo : Array.map() or Array.foreach() 바꿀 수 있길
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
        Error;
        res.status(500).send({ ErrorType: err.name, ErrorMessage: err.message });
    }
});

module.exports = { commentRoute };
