// express 불러오기
const express = require('express');
const { del } = require('express/lib/application');
const { type } = require('express/lib/response');
// express 사용
const app = express();
const { userRouter, blogRouter } = require('./routes'); // ./routes 안의 index.js 불러옴
const mongoose = require('mongoose');
const { generateFakeData } = require('../faker2');

const MONGO_URI = 'mongodb+srv://admin:HyUqimjcaWnMEQ3D@mongodbtutorial.omukq.mongodb.net/BlogService?retryWrites=true&w=majority';

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        // useFindAndModify = false 추가하는 게 좋음. 내부적으로 findAndModify 쓰는데, 추천안하기때문.
        // mongoose.set('debug', true); // Query 변경 보여줌.
        app.use(express.json()); // json parsing
        // Middleware
        app.use('/user', userRouter);
        app.use('/blog', blogRouter);

        app.listen(3000, async () => {
            console.log('server listening on port 3000');
            // for (let i = 0; i < 20; i++) {
            //     await generateFakeData(10, 1, 10);
            // }
        });
    } catch (err) {
        console.log(err);
    }
};

server().then(() => console.log('MongoDB connected!'));
