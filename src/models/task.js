const mongoose = require('mongoose')

//model name converted tto lowercase and store it into the db
//explicit created schema for better customization
const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        //refer to another model( now referencing to the User model)
        ref:'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task',taskSchema)

module.exports = Task