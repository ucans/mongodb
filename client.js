console.log('Client code running1234.');
const axios = require('axios'); // rest api 호출할 때 사용하는 module
const URI = 'http://localhost:3000';

const test = async () => {
    let {
        data: { blogs },
    } = await axios.get(`${URI}/blog`);
    //console.log(blogs.length, blogs[0]);
    blogs = await Promise.all(
        blogs.map(async (blog) => {
            [
                {
                    data: { user },
                },
                {
                    data: { comments },
                },
            ] = await Promise.all([axios.get(`${URI}/user/${blog.user}`), axios.get(`${URI}/blog/${blog._id}/comment`)]);
            blog.user = user;
            blog.comments = await Promise.all(
                comments.map(async (comment) => {
                    const {
                        data: { user },
                    } = await axios.get(`${URI}/user/${comment.user}`).catch(console.log);
                    comment.user = user;
                    return comment;
                })
            );
            return blog;
        })
    );
    console.dir(blogs[0], { depth: 10 });
};

test();
