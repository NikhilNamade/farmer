const mongoose = require("mongoose")
const { Schema } = mongoose;

const preordersSchema = new Schema({
    Status:{
        type: String,
        default : "Pending",
    },
    customerName:{
        type: String,
        required: true,
    },
    customerphNo:{
        type: Number,
        required: true,
    },
    productName:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    productType:{
        type: String,
        required: true,
    },
    productImage:{
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitType: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SELLER", // This will dynamically reference either the SELLER or VENDOR collection
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"BUYER",
        required: true,
    }
})

module.exports = mongoose.model("PREORDER", preordersSchema);