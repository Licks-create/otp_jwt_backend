import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import userModel from "../model/userModel.js";
import { localVariables } from "../middleware/auth.js";
import otpGenerator from "otp-generator"


// post request

export const registerMail = async (req, res, next) => {
  const { username, email, text, subject } = req.body;
  // console.log(req.app.locals.OTP)
  // console.log({username,email,text,subject});
  if (!email) {
    return res.status(401).json({ message: "email required!" });
  }

  try {
    const user = await userModel.find({ email });
    if (!user.length) {
      return res.status(401).json({ message: "Invalid username " + username });
    }
   await sentMail(username,email)
    return res.json({ message: "message sent" });
  } catch (error) {
    next(new Error(error));
  }
};





export const sendOTP = async(req,res,next) => {
  let otp=otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
  const {username,email}=req.body
  req.app.locals.OTP=otp;
  console.log(req.app.locals.OTP)
  try {
    await sentMail(username,email,otp)
    return res.status(201).json({OTP:otp,message:"OTP Sent to User's mail"})
  } catch (error) {
    next(new Error(error))
  }
};








const sentMail=async(username,email,otp)=>{
  otp=otp||undefined
  username=username || undefined
  let config = {
    service: "gmail",
    auth: {
      user: process.env.mail,
      pass: process.env.pass,
    },
  };

  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "vivekanand ojha",
      link: "https://x.com",
    },
  });

  let transporter = nodemailer.createTransport(config);

  let response = {
    body: {
      name: username || `hello ${email}`,
      intro:  "Welcome to Vivek's space! We're very excited to have you on board.",
      action:  otp===undefined?{
        instructions: "We are happy to onbaord you",
        button: {
          color: "#22BC66", 
          text: "Welcome",
        },
      }:{
        instructions: "This is your otp",
        button: {
          color: "#22BC66", 
          text: "OTP:- " + otp,
        },
      },
      outro: "Don't worry! apatheticjanata217@gmail.com is Vivekanand's mailer gmail id",
    },
  };

  let mail = mailGenerator.generate(response);

  let message = {
    from: process.env.mail,
    to: email,
    subject:!otp?"Welcome to vivek's space":" OTP verification",
    html: mail,
  };
  try {
    
    let result = await transporter.sendMail(message);
  } catch (error) {
    console.log(error)
    next(new Error(error))
  }
}