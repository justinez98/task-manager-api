const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')





router.post('/tasks', auth ,async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        //..req.boy will be copy into the new task
        ...req.body,
        owner: req.user._id
    })


    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }



    // const task = new Task(req.body)

    // task.save().then(()=>{
    //     console.log('successs')
    //     res.status(201).send(task)

    // }).catch((e)=>{
    //     //customized the http server status code
    //     res.status(400).send(e)
    //     //same thing res.send(e)
    // })
})
//limit and skip to create pagination 
//GET /tasks?limit=10&skip 
//GET /tasks?completed=false/true
//GET /tasks?sortBy=createdAt:asc //underscore/colon to seperate the field
router.get('/tasks',auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    //
    try {
        // const task = await Task.find({owner:req.user._id}) //or // 
        await req.user.populate({
            path : 'tasks',
            match,
            //options provide the ability to set limit and skip
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
    // //check mongoose doc
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth,async (req, res) => {
    const _id = req.params.id
    
    try {
        // const task = await Task.findById(_id)
        //find the item by the id as well as filtering th task to only show the task that the user created themself
        const task = await Task.findOne({_id,owner:req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
    // // get the item from the url params
    // // console.log(req.params)
    // const _id = req.params.id
    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)

    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//patch is for update



//update for task
router.patch('/tasks/:id',auth, async (req,res)=>{
    
    const updates = Object.keys(req.body) // to get the key of the object
    const allowedUpdates = ['description','completed'] //allow which item to be update
    const isValidOperation = updates.every((update)=>{ //to check every key whether it matches the allowed update list or not
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send( {error:'Invalid Updates!'} )
    }

    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        // const task = await Task.findById(req.params.id)
        
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true })//return new user as apost to the 'user'
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})



router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router