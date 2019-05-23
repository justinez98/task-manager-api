const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const app = express();
const port = process.env.PORT

//customized so that it always return object whenthe json arrive
app.use(express.json())
//post instead of get when we want to post data
//create a new router to store the route (cuz too many in a page) move to suer router
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5cbdb4af7a5da54e7c1bd696')
//     // //allow populate data from a relationship, from id, bring up the whole profile
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('5cbdb4a67a5da54e7c1bd694')
//     await user.populate('tasks').execPopulate()//populate the task where it is stated in the schema.virtual
//     console.log(user.tasks)
    
// }
// main()


//do the middleware b4 the app.use call
// app.use((req,res,next) => {
//    if(req.method === 'GET'){
//     res.send('GET request are disable')
//    }else{
//        next()
//    }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('The server is under maintainance. Please try again later')
// })

// //file upload in express
// const multer = require('multer')
// const upload = multer({//provide the configuraation for file upload
//     dest: 'images',//set destination of file uploaded
//     limits:{//in bytes the file size 6x 0 to turn to mb
//         fileSize: 1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('File must be a WORD document'))
//         }
//         cb(undefined,true)
//         // cb(new Error('File must be a PDF'))
//         // cb(undefined,true)
//         // cb(undefined,false)
//     }

// })
// //provide a upload option middleware in the api
// //key at postman must must be the same name as the single('item') here upload.single('upload')


// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
//     //let epress know the function set up to handle error
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })

//change it  to asyc so that it will return a promise instead
//without express middleware : new request -> runroute handler
//with express middleware: new request -> do smtg -> run route handler 
