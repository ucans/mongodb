console.log('Client code running1234.');
const axios = require('axios'); // rest api 호출할 때 사용하는 module

const test = async () => {
    let {
        data: { blogs },
    } = await axios.get('http://localhost:3000/blog');
    //console.log(blogs.length, blogs[0]);
    blogs = await Promise.all(
        blogs.map(async (blog) => {
            const resUser = await axios.get(`http://localhost:3000/user/${blog.user}`);
            const resComment = await axios.get(`http://localhost:3000/blog/${blog._id}/comment`);
            blog.user = resUser.data.user;
            blog.comments = resComment.data.comments;
            return blog;
        })
    );
    console.log(blogs[0].user);
};

test();
