const express = require("express");
const connectTomongoose = require("./db");
connectTomongoose();
const cors = require("cors");
const app = express();
app.use(cors({
    origin: "https://farmer-gold.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'], // Add 'auth-token' to allowed headers
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", require("./route/auth"));
app.use("/api/product", require("./route/product"));
app.get("/", (req, res) => {
    res.send("hii");
})

app.listen(5000);