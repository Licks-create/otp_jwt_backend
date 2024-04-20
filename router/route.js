import express, {Router} from "express"
import * as controller from "../controllers/appController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { registerMail } from "../controllers/mailer.js"
import Auth ,{localVariables}from "../middleware/auth.js"


const router=Router()
const app=express()
// import all contollers


// post
router.route('/register').post(controller.register)//register user
router.route('/registerMail').post(registerMail)//send Mail
router.route('/authenticate').post(controller.verifyUser,async(req,res,next)=>{
    res.status(200).json('authenticate routes')
})//authenticate User
router.route('/login').post(controller.login)// login in app


 
// verifytoken 
router.use(verifyToken)


// get

router.route('/user/:username').get(controller.getUser)//user with username
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP)//generate otp
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP)//verify generated otp
router.route('/createResetSession').get(controller.createResetSession)//reset all the variables

// put
router.route('/updateUser').put(Auth,controller.updateUser)//is used to update the user variables
router.route('/resetPassword').put(controller.resetPassword)//use to reset password



export default router