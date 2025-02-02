const mongoose = require("mongoose");

const { Schema } = mongoose;

const productData = new Schema({
    productName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
    },
    ownerType: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    unitType:{
        type:String
    },
    productType:{
        type:String
    },
    location: { lat: Number, lng: Number },
    productImg: {
        type: String
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SELLER"
    }
})

module.exports = mongoose.model("PRODUCTDATA", productData);