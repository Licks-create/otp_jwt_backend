import express from "express"
import cors from "cors"
import morgan from "morgan"
import {connectDB} from "./database/conn.js"
import mongoose from "mongoose"
import router from "./router/route.js"
import { errorhandler } from "./middleware/errHandling.js"
import dotenv from 'dotenv' 
dotenv.config() 
import nodemailer from "nodemailer"
import Mailgen from "mailgen"


const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.disable('x-powered-by')
app.use(morgan('tiny')) 
  
connectDB() 




// api routes

app.get('/',(req,res,next)=>{
    return res.json({message:"Home Page"})
})

app.use('/api',router)
app.use('/secret/vivek',router)





const port=process.env.PORT||8001;
// http get request 
app.get('/',(req,res,next)=>{
    res.status(201).json({message:"Home Get Request"})
    res.end()  
})
app.use(errorhandler) 

mongoose.connection.once('open',()=>{   
    app.listen(port,()=>console.log(`server running on port ${port}`))    
})

mongoose.connection.on("error",(err)=>{
    console.log("error in connection!!")
})
 