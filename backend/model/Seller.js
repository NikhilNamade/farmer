const mongoose = require("mongoose");

const { Schema } = mongoose;

const sellerSchema = new Schema({
    userType: {
        type: String,
        default: "Seller",
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
    },
    address: {
        type: String,
    },
    location: { lat: Number, lng: Number },
    ratings: [Number],
    totalRating: { type: Number, default: 0 },
})

module.exports = mongoose.model("SELLER", sellerSchema);