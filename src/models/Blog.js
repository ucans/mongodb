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

// 가상의 key 생성
BlogSchema.virtual('comments', {
    ref: 'comment',
    localField: '_id',
    foreignField: 'blog',
});

BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });

const Blog = model('blog', BlogSchema);
module.exports = { Blog };
