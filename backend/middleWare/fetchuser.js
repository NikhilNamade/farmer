const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisfarmerconsumerwebsite";

const fetchuser = (req,res,next)=>{
    try {
        const token = req.header("token");
        if(!token){
            return res.status(404).json({error:"Token is not available"});
        }
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.error(error+"occur in middleware");
    }
}

module.exports = fetchuser;