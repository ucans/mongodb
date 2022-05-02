// 실무하다보면, Promise 만들어서 사용할 수 있음.

// const { type } = require("express/lib/response")
// Event Loop부터, RUN TIME 관련된 것들은 따로 찾아보세요.

const addSum = (a, b) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if(typeof a !== 'number' || typeof b !== 'number') {
            reject('a, b must be nubmers.')
        }
        resolve(a+b)
    }, 1000)
})

const sub = (a, b) => new Promise( (resolve, reject) => setTimeout(() => {
            if(typeof a !== 'number' && typeof b !== 'number') {
                reject('a, b must be numbers.')
            }
            resolve(a - b)
        }, 1000)
)

addSum(10, 20)
    .then( sum => addSum(sum, 1))
    .then( sum => addSum(sum, 1))
    .then( sum => console.log({ sum }) )    // resolve
    .catch( error => console.log({ error }))    // reject


sub(40, 20)
    .then( result => console.log({ result }))   // resolve
    .catch( error => console.log({ error }))    // reject


const totalSum = async() => {
    try {
        let sum = await addSum(100, 10)
        sum = await addSum(sum, 20)
        console.log({ sum })
    } catch(error){
        console.log({ error })
    } 
}
console.log(totalSum())

// Promise.all([])