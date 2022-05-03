const { Router } = require('express');
const { use } = require('express/lib/router');
const userRouter = Router();
const mongoose = require('mongoose');
const { User } = require('../models');

userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({}); // 배열 return, findOne() -> 객체 return
        return res.send({ users });
    } catch (err) {
        console.log(err);
        return res.status(501).send({ err: err.message });
    }
});

// todo : :userId
userRouter.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(401).send({ err: 'Invalid userId' });
        const user = await User.findOne({ _id: userId }, { username: 1, name: 1, age: 1 });
        return res.send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// todo : put, findByIdAndUpdate( , , { new: ture}) --> 바뀐 후, data return.
userRouter.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(402).send({ err: 'There is no user.' });
        const { age, name } = req.body;
        if (!name) return res.status(403).send({ err: 'NAME is no where.' });
        if (!age) return res.status(403).send({ err: 'AGE is no where.' });

        if (age && typeof age !== 'number') res.status(405).send({ err: 'age type is not a number.' });
        if (name && typeof name.first !== 'string' && typeof name.last !== 'string')
            res.status(405).send({ err: 'name typs should be string.' });
        // DB 1번만 접근!
        // let updateBody = {};
        // if (age) updateBody.age = age;
        // if (name) updateBody.name = name;
        // const updateOne = await User.findByIdAndUpdate(userId, updateBody, { new: true });

        // DB 2번 접근
        // 1. getDoc, 2. updateDoc
        let user = await User.findById(userId);
        console.log({ userBeforeEdit: user });
        if (age) user.age = age;
        if (name) user.name = name;
        console.log({ userAftereEdit: user });
        await user.save(); // moongose가 updateOne()실행
        return res.send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// todo : deleteOnd, findOndAndDelete
userRouter.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(401).send({ err: 'The invalid user.' });
        // 근데 지우기 전에 DB에 해당 유저 있는 지 체크 어케함?
        const deletedOne = await User.findByIdAndDelete(userId);
        res.send(deletedOne);
    } catch (err) {
        console.log({ err });
        res.status(500).send({ err: err.message });
    }
});

userRouter.post('/', async (req, res) => {
    try {
        let { username, name } = req.body; // 디스트럭쳐링
        if (!username) return res.status(400).send({ err: 'username is required' });
        if (!name || !name.first || !name.last) return res.status(400).send({ err: 'name is required' });

        const user = new User(req.body); // user 문서 생성
        await user.save(); // 실제로 저장
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = {
    userRouter,
};
