import mongoose from "mongoose";
export const userschema=mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide username"],
        unique:[true,"Username exists"]
    },
    password:{
        type:String,
        required:[true,"Please provide password"]
    },
    email:{
        type:String,
        required:[true,"Please provide email"]
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    mobile:{
        type:Number,
    },
    address:{
        type:String,
    },
    profile:{
        type:String,
    }
})

export default mongoose.model.users || mongoose.model('users',userschema)