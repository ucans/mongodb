const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
        },
        age: Number,
        email: String,
    },
    { timestamps: true }
);

// user 컬렉션, UserSchema 스키마 갖고있음.
// 실제로는 users 컬렉션 생성
const User = model('user', UserSchema);

module.exports = { User };
