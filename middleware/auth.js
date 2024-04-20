import jwt from "jsonwebtoken"
// Auth middleware


export default async function Auth(req,res,next){
    try {
        // access the authorized header to validate
       const authToken=req.headers.authorization?.split(" ")[1];
       
       // jwt verify
       const decodedToken=await jwt.verify(authToken,process.env.ACCESS_TOKEN_SECRET)
    //    console.log(decodedToken);
       
       //    retrive the userdetails
       req.user=decodedToken;
       next()        

    } catch (error) {
        next(new Error(error))
    } 
}
 
export function localVariables(req,res,next){
    req.app.locals={
        OTP:null,
        resetSession:false,
    }
    next()
}