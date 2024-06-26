import userModel from "../model/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import otpGenerator from "otp-generator"





export async function verifyUser(req,res,next){

    
    const {email} = req.method=='GET'?req.query:req.body


    if(!email){
        return res.status(403).json({message:"useremail required!"})
    }

    // check existance useremail
    const existingUsername=await userModel.findOne({email});
    // console.log(existingUsername); 
    
    if(!existingUsername){
        return res.status(401).json({message:"email not present"})
    } 
    next()
} 






export async function register(req,res,next)
{
    try {
        const {username="user",password,profile="profilepic",email,mobile=91} = req.body
        
        // console.log({username,password,mobile,email,profile});
        
        if(!password||!email){
            return res.status(403).json({message:"All fields are required!"})
        }

        // check existance username
        const existingUsername=await userModel.findOne({email});
        // console.log(existingUsername); 
        
        if(existingUsername){
            return res.status(401).json({message:"email already in use"})
        } 

        // check existance email 
        // const existanceemail=await userModel.findOne({email});
        // // console.log(existanceemail);

        // if(existanceemail){
        //     return res.status(401).json({message:"email already present"})
        // }

        // // check existance mobile 
        // const existancemobile=await userModel.findOne({mobile});
        // // console.log(existanceemail);

        // if(existancemobile){
        //     return res.status(401).json({message:"mobile already used"})
        // }


        const hashedPassword= await bcrypt.hash(password,10);
        
        const newUser={username,profile:profile?profile:'image/jpg',password:hashedPassword,email,mobile}

        const addedUser=await userModel.create(newUser) 
        if(addedUser){

            return res.status(201).json({message:`new ${username} user added to database`,addedUser})
        }
        return res.status(403).json({message:"not added to database",newUser})
    } catch (error) {
        next(new Error(error))
    }
}
 
 






export async function login(req,res,next)
{
    const {email,password} = req.body

    if(!email||!password){
        return res.status(401).json({
            message:"All fields are required!"
        })
    }

    try {
        const user=await userModel.findOne({email})

        let passwodCheck =false;

        if(user){
        const {username,profile,email,mobile}=user
        

        passwodCheck=await bcrypt.compare(password,user.password)
         if(passwodCheck){
            // create jwt token

            const accessToken=jwt.sign({
                "userinfo":{
                    "username":username,
                    mobile,
                    "id":user._id,
                    "email":email
                }
            },process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'})
            
            const refreshToken=jwt.sign({
                "userinfo":{
                    "username":username,
                    "email":email
                }
            },process.env.REFRESH_TOKEN_SECRET,{expiresIn:'10d'})

            // openssl rand -base64 64 for REFRESH_TOKEN_SECRET or ACCESS_TOKEN_SECRET

            // set coockie in res 


            // return final response
             return res.status(200).json({
                message:"login succesfull",
                 user:{
                     username,profile,email,mobile
                 },accessToken
             })
         }
        //  req.token=accessToken;

         return res.status(404).json({
             message:"invalid password"
         })

        }


        return res.status(404).json({
            message:"username not present"
        })
        

    } catch (error) {
        
        next(new Error(error))
    }
}











export async function getUser(req,res,next)
{
    try {
        const {email}=req.params
        const obj = await userModel.find({email}).select("-password")
        
        if(obj?.length)
        return res.status(201).json({data:obj})

        return res.json({message:"useremail "+email+" not found!"})
    } catch (error) {
        next(new Error(error))
    }
} 







export async function updateUser(req,res,next)
{

    // update by email (after otp varifcation)
    if(req.body){
        const {email,location, age ,work_details} = req.body
        if(!email){ 
            return res.status(401).json({message:"email is required"})  
        }
        try {
            
            const emailCheck=await userModel.findOne({email});
            if(!emailCheck){
                return res.status(401).json({message:"User not present"}) 
        } 
        const user=await userModel.updateOne({email},{location, age ,work_details})
        return res.status(201).json({message:"user updated",user})
    } catch (error) {
        next(new Error(error))   
    }
    
}
else
// update by userID
    try {
        // const id=req.query.id;
        const {id}=req.user.userinfo;
        // console.log(req.user);
        
        if(!id){
            return res.status(401).json({message:"id required!"})
        }
        const {firstName,lastName,address,username,email,profile,mobile}=req.body

        // if(!firstName||!lastName||!address||!username||!email||!profile){
        //     return res.status(400).json({message:"All fields are required to update"})
        // }
        if(username){
            const usernameCheck=await userModel.findOne({username});
            // if(usernameCheck){
            //     return res.status(401).json({message:"username already in use"})
            // }
        }

        // if(email){ 
        //     const emailCheck=await userModel.findOne({email});
        //     if(emailCheck){
        //         return res.status(401).json({message:"email already in use"}) 
        //     }   
        // }
        const user=await userModel.updateOne({_id:id},{firstName,lastName,address,username,email,profile,mobile})
        return res.status(201).json({user})
    } catch (error) {
        next(new Error(error))
    }   
}   
  
 







// reset password
export async function generateOTP(req,res,next){

    req.app.locals.OTP=otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
    
    // console.log(req.app.locals);
    
    next()
   
}




export async function verifyOTP(req,res)
{
    const {otp} = req.method=='GET'?req.query:req.body
    console.log("req.app.locals.OTP",req.app.locals.OTP,otp);
    
    if(parseInt(req.app.locals.OTP)===parseInt(otp)){
        req.app.locals.OTP=null,//reset the otp
        req.app.locals.reserSession=true;//start session for reset otp
        return res.status(201).json({message:"OTP varified successfully"})
    }
    return res.status(401).json({message:"invalid otp"})
}



// succefully redirect user when otp is valid
export async function createResetSession(req,res)
{
    if(req.app.locals.reserSession){
        req.app.locals.reserSession=false;
        return res.status(201).json({message:"Access granted!"})
    }
    return res.status(201).json({message:"session expired!"})
}




 
// update the password when we have valid session
export async function resetPassword(req,res)
{
    if(!req.app.locals.reserSession)
    return res.status(404).json({message: "session expired!"})
    try {
        const {username,newPassword}=req.body;
        if(!username||!newPassword){ 
            return res.status(403).json({message:"All field are required"})
        }
        const existingUsername=await userModel.findOne({username});
 
        if(!existingUsername){ 
            return res.status(401).json({message:"Incorrect username"})
        }
        
        

        const password=await bcrypt.hash(newPassword,10);
        if(!password){
            return res.status(403).json({message:"hashing faild"})
        }


        existingUsername.password=password;
        const updatedUser=await existingUsername.save();

        if(!updateUser){
            return res.status(401).json({message:"password could not be updated"})
        }

        req.app.locals.reserSession=false
        return res.status(200).json({message:"password successfully changed"})

    } catch (error) {
        next(new Error(error))
    }
}


export const deleteALL=async(req,res,next)=>{
    const {password}=req.body
    if(password==="vivek")
    try {
        const de=await userModel.deleteMany();
        return res.status(201).json({message:"deleted all"})
    } catch (error) {
        next(new Error(error))
    }
    else
    next(new Error({message:"NOT AITHORIZED"}))
}