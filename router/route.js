import express, {Router} from "express"
import * as controller from "../controllers/appController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { registerMail, sendOTP } from "../controllers/mailer.js"
import Auth ,{localVariables}from "../middleware/auth.js"


const router=Router()
const app=express()
// import all contollers


// post
router.route('/register').post(controller.register)//register user
router.route('/registerMail').post(registerMail)//send Mail
router.route('/generateOTP').post(controller.verifyUser,localVariables,sendOTP)//generate otp
router.route('/verifyOTP').post(controller.verifyUser,controller.verifyOTP)//verify generated otp
router.route('/updateUser').put(controller.updateUser)
router.route('/login').post(controller.login)// login in app
router.route('/deletall').delete(controller.deleteALL)// login in app


 
// verifytoken 
router.use(verifyToken)


// get

router.route('/user/:email').get(controller.getUser)//user with username


// below for client side i.e doing smae thing as above but with more security & with 'get' http method
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP)//generate otp
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP)//verify generated otp
router.route('/createResetSession').get(controller.createResetSession)//reset all the variables

// put
router.route('/updateUser').put(Auth,controller.updateUser)//is used to update the user variables
router.route('/resetPassword').put(controller.resetPassword)//use to reset password



export default router