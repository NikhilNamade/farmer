const mongoose = require("mongoose");
const { Schema } = mongoose;

const buyerSchema = new Schema({
    userType:{
        type:String,
        default : "Buyer",
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phoneNo:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
    },
    address:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model("BUYER",buyerSchema);