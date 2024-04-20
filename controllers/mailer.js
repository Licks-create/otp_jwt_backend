import nodemailer from "nodemailer"
import Mailgen from "mailgen"
import userModel from "../model/userModel.js"




// post request

export const registerMail=async(req,res,next)=>{

    
    const {username,useremail,text,subject}=req.body
    // console.log({username,useremail,text,subject});
   if(!username||!useremail){
    return res.status(401).json({message:"All fields are required"})
   }

   let config={
    service:'gmail',
    auth:{
        user:process.env.mail, 
        pass:process.env.pass 
    }
} 

let mailGenerator=new Mailgen({
    theme:"default",
    product:{
        name:"vivekanand ojha",
        link:"https://x.com" 
    }
})

    let transporter=nodemailer.createTransport(config)

    let response={  
        body:{
            name:username,
            intro:text||"Your bill arrived",
            table:{  
                data:[{
                    item:"Nodemailed stack book",
                    description:"A backend stack application",
                    price:"12$"
                }] 
            },
            outro:"lookiing forward"
        }
    }

    let mail=mailGenerator.generate(response)

    let message={
        from :process.env.mail,
        to:useremail,
        subject,
        html:mail
    }



    try {

        const user=await userModel.find({username})
        if(!user.length){
            return res.status(401).json({message:"Invalid username "+username})
        }
        
        let result=await  transporter.sendMail(message)
        return res.json({message:"message sent"})   

    } catch (error) {
     next(new Error(error))   
    }
 
  }