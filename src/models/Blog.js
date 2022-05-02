const { Schema, model, Types } = require('mongoose');

const BlogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        islive: { type: Boolean, required: true, default: false },
        user: { type: Types.ObjectId, required: true, ref: 'user' }, // ref: user collection 가르킴
    },
    { timestamps: true } // createdAt, updateAt
);

const Blog = model('blog', BlogSchema);
module.exports = { Blog };
