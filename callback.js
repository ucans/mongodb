const addSum = (a, b, callback) => {
    setTimeout(() => {
        if(typeof a !== 'number' || typeof b !== 'number')  return callback('a, b, must be nubmers.')
        callback(undefined, a+b)
    }, 1000);
}

let callback = (error, sum) => {
    if(error) return console.log( { error } );
    console.log({ sum })
}

addSum(10, 20, (error, sum) => {
    if(error) return console.log( {error} )
    console.log({ sum })   
    addSum(sum, 15, (error, sum) =>{
        if(error) return console.log({ error })
        console.log({ sum })
    });
});