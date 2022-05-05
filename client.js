console.log('Client code running1234.');
const axios = require('axios'); // rest api 호출할 때 사용하는 module
const URI = 'http://localhost:3000';

// 이상적 시간 : 200ms
// 최소 : 500ms 이하여야함

const test = async () => {
    console.time('loading time: ');
    await axios.get(`${URI}/blog`);
    // blogs = await Promise.all(
    //     blogs.map(async (blog) => {
    //         [
    //             {
    //                 data: { user },
    //             },
    //             {
    //                 data: { comments },
    //             },
    //         ] = await Promise.all([axios.get(`${URI}/user/${blog.user}`), axios.get(`${URI}/blog/${blog._id}/comment`)]);
    //         blog.user = user;
    //         blog.comments = await Promise.all(
    //             comments.map(async (comment) => {
    //                 const {
    //                     data: { user },
    //                 } = await axios.get(`${URI}/user/${comment.user}`).catch(console.log);
    //                 comment.user = user;
    //                 return comment;
    //             })
    //         );
    //         return blog;
    //     })
    // );
    console.timeEnd('loading time: ');
    //console.dir(blogs[0], { depth: 10 });
};

const testGroup = async () => {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
};

testGroup();
