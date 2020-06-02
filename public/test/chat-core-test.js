function tmp() {
    return new Promise(((resolve, reject) => {
        console.log("1");
        resolve();
    })
    )
}
tmp().then(()=>{
    console.log("2")
})
console.log("3");