const express = require("express");
const connectTomongoose = require("./db");
connectTomongoose();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./route/auth"));
app.use("/api/product", require("./route/product"));
app.get("/", (req, res) => {
    res.send("hii");
})

app.listen(5000);