const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        user: { type: ObjectId, required: true, ref: 'user' },
        blog: { type: ObjectId, required: true, ref: 'blog' },
    },
    { timestamps: true }
);

// collection name은 뒤에 s 자동으로 붙음.
const Comment = model('comment', CommentSchema);
module.exports = { Comment };
