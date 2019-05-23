const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

//schema is run b4 or after some fuction in mongoose, in this case, b4 saving the password
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        //check mongoose doc to check
        required: true,
        trim:true
    },
    email:{
        type:String,//receive a string
        unique:true,//make sure no repetitive email
        required:true,//must be input
        trim:true,//cut out the space
        lowercase:true, //turn all to lower letter
        validate(value){
            //isEmail is a validator library
            if(!validator.isEmail(value)){
                //output the new eeor using javascript default error messsage new Error
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain  "password"')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        //custome validation
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        //store the iage buffer within the model
        type:Buffer
    }
},{
    //create a user with a timestamp automatically
    timestamps: true
})
//use to hide data from the user side
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
//used to set up virtual attribute
//not stored in the database, for mongoose to know the relationship only
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//user userschemea.method to run normal method
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//create userSchema.stattics make the model able to access this function for finding item in db
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//hash the plain text password b4 saving
//provide pre or post b4 or after that particular scmhema
userSchema.pre('save',async function(next){
    //this provide access to individual user that about to be save
    const user = this
    //check of the user password is been modified
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()//provide to show that the function is done
})
//middleware to delete user task when the user is remove
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({ owner: user._id }) //delete when the user is remove
    next()
})



const User = mongoose.model('User',userSchema)

module.exports = User