const mongoose = require("mongoose");

const mongoURL = process.env.MONGOOSE;


const connectTomongoose = async()=>{
    await mongoose.connect(mongoURL)
console.log("Connected db");
}

module.exports = connectTomongoose;