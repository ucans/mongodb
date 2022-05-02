const { Router } = require('express');
// blogIdx 가져올 수 있음
const commentRoute = Router({ mergeParams: true });
const { Comment } = require('../models/Comment');
const { Blog } = require('../models/Blog');
const mongoose = require('mongoose');
const { User } = require('../models/User');

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
        let user = await User.findById(userIdx);
        if (!user) return res.status(400).send({ err: 'the user not exists.' });

        // blog doc 받아옴.
        let blog = await Blog.findById(blogIdx);
        if (!blog) return res.status(400).send({ err: 'the blogIdx Blog not exists.' });

        // 저장할 때는 user/blog doc에 있는 _id를 참조 저장.
        const commentRequst = new Comment({ content: content, user: user, blog: blog });
        await commentRequst.save();
        return res.send(commentRequst);
    } catch (err) {
        console.log({ err });
        res.status(500).send({ ErrorType: err.name, ErrorMessage: err.message });
    }
});

commentRoute.get('/', async (req, res) => {
    try {
        const comments = await Comment.find({});
        return res.send({ comments });
    } catch (err) {
        console.log({ err });
        Error;
        res.status(500).send({ ErrorType: err.name, ErrorMessage: err.message });
    }
});

module.exports = { commentRoute };
