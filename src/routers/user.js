const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail,sendCancelationEmail } = require('../emails/account')

router.post('/users',async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }


    // user.save().then(()=>{
    //     console.log('successs')
    //     res.status(201).send(user)

    // }).catch((e)=>{
    //     res.status(400).send(e)
    //     //same thing res.send(e)
    // })

})

router.post('/users/login', async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})//short hand syntax
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
//     // get the item from the url params
//     // console.log(req.params)
//     // const _id = req.params.id
//     // User.findById(_id).then((user) => {
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)

//     // }).catch((e)=>{
//     //     res.status(500).send(e)
//     // })
// })



router.delete('/users/me',auth,async (req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/users/me',auth, async (req,res)=>{
    
    const updates = Object.keys(req.body) // to get the key of the object
    const allowedUpdates = ['name','email','password','age'] //allow which item to be update
    const isValidOperation = updates.every((update)=>{ //to check every key whether it matches the allowed update list or not
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Updates!'})
    }

    try{
        //change it so it adapt to the save function and allow the hash function to work
        // const user = await User.findById(req.params.id) //the entire user detail from db
        updates.forEach((update)=>{
            req.user[update] = req.body[update] //update the aprticuar filed with the updates obtain above
        })
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true })//return new user as apost to the 'user'
        // if(!req.user){
        //     return res.status(404).send
        // }
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

const upload = multer({//provide the configuraation for file upload
    // dest: 'avatars', if never state the destination, the image will be pass into the function instead
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar', auth ,upload.single('avatar'),async (req,res)=>{
    // req.user.avatar = req.file.buffer//thi function only workable if the dest is not set up
    //buffer modify image file from sharp #sharp is a asynchronous function
    ///png() change the image to png format only //resize receive the size of image to be store
    const buffer = await sharp(req.file.buffer).resize( {width:250  , height:250 }).png().toBuffer() 
    req.user.avatar = buffer
    await  req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}
)

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user= await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
}
)

module.exports = router