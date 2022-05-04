const { Router } = require('express');
const blogRouter = Router();
const { Blog, User } = require('../models');
const mongoose = require('mongoose');
const res = require('express/lib/response');
const { type } = require('express/lib/response');

const { commentRoute } = require('./commentRoute');
// middleware 추가 가능
blogRouter.use('/:blogIdx/comment', commentRoute);

blogRouter.post('/', async (req, res) => {
    try {
        const { title, content, islive, userId } = req.body;
        if (typeof title !== 'string') res.status(400).send({ err: 'title is required' });
        if (typeof content !== 'string') res.status(400).send({ err: 'content is required' });
        if (islive && typeof islive !== 'boolean') res.status(400).send({ err: 'islive is not boolean' });
        if (!mongoose.isValidObjectId(userId)) res.status(400).send({ err: 'userId is invalid' });

        let user = await User.findById(userId);
        console.log({ user });
        if (!user) res.status(400).send({ err: 'user dose not exists.' });

        // Mongoose 6
        // user 데이터 object 자체를 삽입해야함. by .toObject
        let blog = new Blog({ ...req.body, user: user.toObject() });
        await blog.save();
        return res.send({ blog });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ err: err.message });
    }
});

blogRouter.get('/', async (req, res) => {
    try {
        // production에서 사용 가능할 정도의 성능
        // populate를 통해, 총 4번 db 연결
        // 중복된 유저 한 번만 접근 가능
        const blogs = await Blog.find({})
            .limit(20)
            .populate([{ path: 'user' }, { path: 'comments', populate: { path: 'user' } }]);

        return res.send({ blogs });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ err: err.message });
    }
});

blogRouter.get('/:blogIdx', async (req, res) => {
    try {
        const { blogIdx } = req.params;
        if (!mongoose.isValidObjectId(blogIdx)) res.status(400).send({ err: 'invalid blogId' });
        const blog = await Blog.findById(blogIdx);
        return res.send({ blog });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ err: err.message });
    }
});

blogRouter.put('/:blogIdx', async (req, res) => {
    try {
        const { blogIdx } = req.params;
        const { title, content } = req.body;
        if (!mongoose.isValidObjectId(blogIdx)) res.status(400).send('blogIdx is invalid.');
        if (typeof title !== 'string') res.status(400).send('title is required!');
        if (typeof content !== 'string') res.status(400).send('content is required!');

        const blog = await Blog.findByIdAndUpdate(blogIdx, { title, content }, { new: true });
        return res.send({ blog });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ err: err.message });
    }
});

blogRouter.patch('/:blogIdx/islive', async (req, res) => {
    try {
        const { blogIdx } = req.params;
        const { islive } = req.body;
        if (!mongoose.isValidObjectId(blogIdx)) res.status(400).send({ err: 'blogIdx is invalid.' });
        if (typeof islive !== 'boolean') res.status(400).send({ err: 'islive is required' });

        let blog = await Blog.findById(blogIdx);
        blog.islive = islive;
        await blog.save();
        return res.send({ blog });
    } catch (err) {
        console.log({ err });
        res.status(500).send({ err: err.message });
    }
});

blogRouter.delete('/:blogIdx', async (req, res) => {
    try {
        const { blogIdx } = req.params;
        if (!mongoose.isValidObjectId(blogIdx)) res.status(400).send('blogIdx is invalid.');
        const blog = Blog.findOneAndDelete(blogIdx);
        return res.send({ blog });
    } catch (err) {
        console.log({ err });
        err.status(500).send({ err: err.message });
    }
});

module.exports = { blogRouter };
