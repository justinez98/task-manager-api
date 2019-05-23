const mongoose = require('mongoose')
//validate any input using validator library
// const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify:false
})
//mongoose help use model to create database instead of doing insertion read manually































// const me = new User({
//     name:'         Mike           ',
//     email:'    MYEMAIL@MEAD.IO     ',
//     password: '       PASSWORq123     '

// })

// //simply saving the data we created into the database
// //__v save the version of the db
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('error ',error)
// })


// const task = new Task({
//     description:'Learn the mongoose library',
//     completed:false
// })
// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })