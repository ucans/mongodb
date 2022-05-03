module.exports = {
    ...require('./blogRoute'),
    ...require('./commentRoute'),
    ...require('./userRoute'),
};
// 합쳐서 하나의 객체로 export
