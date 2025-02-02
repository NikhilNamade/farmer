const express = require("express");
const route = express();
const BUYER = require("../model/Buyer");
const SELLER = require("../model/Seller");
const VENDOR = require("../model/Vendor")
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisfarmerconsumerwebsite";
const fetchuser = require("../middleWare/fetchuser");
let success = false;
const multer = require("multer")
//aws s3 bucket

const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEY,
        secretAccessKey: process.env.SECRETKEY,
    },
});



// Multer setup to handle file uploads
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ storage });

//create buyer http://localhost:5000/api/auth/buyer
route.post("/buyer",
    upload.fields([{ name: 'profile', maxCount: 1 }]),
    [
        body("email").isEmail(),
        body("phoneNo").isLength({ max: 10 }),
        body("password").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            success = false;
            return res.json({ success, error: error })
        }

        try {


            const uploadFile = async (file, filename) => {
                let contentType;

                // Determine content type based on file MIME type
                switch (file.mimetype) {
                    case "image/jpeg":
                    case "image/jpg":
                        contentType = "image/jpeg";
                        break;
                    case "image/png":
                        contentType = "image/png";
                        break;
                    case "image/gif":
                        contentType = "image/gif";
                        break;
                    default:
                        contentType = "application/octet-stream";
                }

                const uploadParams = {
                    Bucket: process.env.BUCKET,
                    Key: filename,
                    Body: file.buffer, // File content from memory
                    ContentType: contentType,
                };

                const upload = new Upload({
                    client: s3,
                    params: uploadParams,
                });

                const response = await upload.done();
                return response.Location; // S3 URL
            };

            // Upload image and resume
            const profileimgUrl = await uploadFile(
                req.files["profile"][0],
                `image-${Date.now()}-${req.files["profile"][0].originalname}`
            );

            const { name, email, phoneNo, password, address } = req.body;
            let user = await BUYER.findOne({ email: email });
            let userSeller = await SELLER.findOne({ email: email });
            let userVendor = await VENDOR.findOne({ email: email });
            if (user || userSeller || userVendor) {
                success = false;
                return res.json({ success, error: "User Already Exists" })
            }
            const hash = bcrypt.hashSync(password, saltRounds);
            user = await BUYER.create({
                name,
                email,
                phoneNo,
                password: hash,
                address,
                profile: profileimgUrl
            })
            const savedata = await user.save();
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwttoken = jwt.sign(data, JWT_SECRET);
            success = true;
            return res.json({ success, savedata, jwttoken });
        } catch (error) {
            console.error(error);
        }
    })

// create seller http://localhost:5000/api/auth/seller

route.post("/seller",
    upload.fields([{ name: 'profile', maxCount: 1 }]),
    [
        body("email").isEmail(),
        body("phoneNo").isLength({ max: 10 }),
        body("password").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            success = false;
            return res.json({ success, error: "Wrong Credintials" })
        }
        try {

            const uploadFile = async (file, filename) => {
                let contentType;

                // Determine content type based on file MIME type
                switch (file.mimetype) {
                    case "image/jpeg":
                    case "image/jpg":
                        contentType = "image/jpeg";
                        break;
                    case "image/png":
                        contentType = "image/png";
                        break;
                    case "image/gif":
                        contentType = "image/gif";
                        break;
                    default:
                        contentType = "application/octet-stream";
                }

                const uploadParams = {
                    Bucket: process.env.BUCKET,
                    Key: filename,
                    Body: file.buffer, // File content from memory
                    ContentType: contentType,
                };

                const upload = new Upload({
                    client: s3,
                    params: uploadParams,
                });

                const response = await upload.done();
                return response.Location; // S3 URL
            };

            // Upload image and resume
            const profileimgUrl = await uploadFile(
                req.files["profile"][0],
                `image-${Date.now()}-${req.files["profile"][0].originalname}`
            );
            const { name, email, phoneNo, password, address, location } = req.body;
            let user = await SELLER.findOne({ email: email });
            let userBuyer = await BUYER.findOne({ email: email });
            let userVendor = await VENDOR.findOne({ email: email });
            if (user || userBuyer || userVendor) {
                success = false;
                return res.json({ success, error: "User Already Exists" })
            }
            const hash = bcrypt.hashSync(password, saltRounds);
            const parsedLocation = JSON.parse(location);
            user = await SELLER.create({
                name,
                email,
                phoneNo,
                password: hash,
                address,
                profile: profileimgUrl,
                location: parsedLocation,
            })
            const savedata = await user.save();
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwttoken = jwt.sign(data, JWT_SECRET);
            success = true;
            return res.json({ success, savedata, jwttoken });
        } catch (error) {
            console.error(error);
        }
    })

// create vendor http://localhost:5000/api/auth/vendor
route.post("/vendor",
    upload.fields([{ name: 'profile', maxCount: 1 }]),
    [
        body("email").isEmail(),
        body("phoneNo").isLength({ max: 10 }),
        body("password").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            success = false;
            return res.json({ success, error: "Wrong Credintials" })
        }
        try {

            const uploadFile = async (file, filename) => {
                let contentType;

                // Determine content type based on file MIME type
                switch (file.mimetype) {
                    case "image/jpeg":
                    case "image/jpg":
                        contentType = "image/jpeg";
                        break;
                    case "image/png":
                        contentType = "image/png";
                        break;
                    case "image/gif":
                        contentType = "image/gif";
                        break;
                    default:
                        contentType = "application/octet-stream";
                }

                const uploadParams = {
                    Bucket: process.env.BUCKET,
                    Key: filename,
                    Body: file.buffer, // File content from memory
                    ContentType: contentType,
                };

                const upload = new Upload({
                    client: s3,
                    params: uploadParams,
                });

                const response = await upload.done();
                return response.Location; // S3 URL
            };

            // Upload image and resume
            const profileimgUrl = await uploadFile(
                req.files["profile"][0],
                `image-${Date.now()}-${req.files["profile"][0].originalname}`
            );
            const { name, email, phoneNo, password, address, location } = req.body;
            let user = await VENDOR.findOne({ email: email });
            let userSeller = await SELLER.findOne({ email: email })
            let userBuyer = await BUYER.findOne({ email: email });
            if (user || userBuyer || userSeller) {
                success = false;
                return res.json({ success, error: "User Already Exists" })
            }
            const parsedLocation = JSON.parse(location);
            const hash = bcrypt.hashSync(password, saltRounds);
            user = await VENDOR.create({
                name,
                email,
                phoneNo,
                password: hash,
                address,
                profile: profileimgUrl,
                location: parsedLocation,
            })
            const savedata = await user.save();
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwttoken = jwt.sign(data, JWT_SECRET);
            success = true;
            return res.json({ success, savedata, jwttoken });
        } catch (error) {
            console.error(error);
        }
    })

// login both seller buyer http://localhost:5000/api/auth/login
route.post("/login",
    [
        upload.none(),
        body("email").isEmail(),
        body("password").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            success = false;
            return res.json({ success, error: error })
        }
        try {
            const { email, password } = req.body;
            console.log(password)
            let userBuyer = await BUYER.findOne({ email: email });
            let userSeller = await SELLER.findOne({ email: email });
            let userVendor = await VENDOR.findOne({ email: email });
            if (userBuyer) {
                const validPassword = await bcrypt.compare(password, userBuyer.password);
                if (!validPassword) {
                    success = false;
                    return res.status(404).json({ success, error: "User Not Found password" });
                }
                let user = userBuyer
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const jwttoken = jwt.sign(data, JWT_SECRET);
                success = true;
                return res.json({ success, user, jwttoken });
            }
            if (userSeller) {
                const validPassword = await bcrypt.compare(password, userSeller.password);
                if (!validPassword) {
                    success = false;
                    return res.status(404).json({ success, error: "User Not Found password" });
                }
                let user = userSeller
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const jwttoken = jwt.sign(data, JWT_SECRET);
                success = true;
                return res.json({ success, user, jwttoken });
            }
            if (userVendor) {
                const validPassword = await bcrypt.compare(password, userVendor.password);
                if (!validPassword) {
                    success = false;
                    return res.status(404).json({ success, error: "User Not Found password" });
                }
                let user = userVendor
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const jwttoken = jwt.sign(data, JWT_SECRET);
                success = true;
                return res.json({ success, user, jwttoken });
            }
            if (!userVendor && !userSeller && !userBuyer) {
                success = false;
                return res.status(404).json({ success, error: "User Not Found" });
            }
        } catch (error) {
            console.error(error);
        }
    })

// change password http://localhost:5000/api/auth/changepassword
route.put("/changepassword",
    [
        upload.none(),
        body("email").isEmail(),
        body("password").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            success = false;
            return res.json({ success, error: error })
        }
        try {
            const { email, password } = req.body;
            let user = await BUYER.findOne({ email: email });
            if (user) {
                const hashPassword = bcrypt.hashSync(password, saltRounds);
                user.password = hashPassword;
                const updatedUser = await user.save();
                success = true;
                return res.json({ success, updatedUser })
            } else {
                user = await SELLER.findOne({ email: email });
                if (!user) {
                    success = false;
                    return res.status(404).json({ success, error: "User Not Found" });
                }
                const hashPassword = bcrypt.hashSync(password, saltRounds);
                user.password = hashPassword;
                const updatedUser = await user.save();
                success = true;
                return res.json({ success, updatedUser })
            }
        } catch (error) {
            console.error(error);
        }
    })

// fetchbyid http://localhost:5000/api/auth/fetchbyid
route.get("/fetchbyid", fetchuser, async (req, res) => {
    try {
        const id = req.user.id;
        let userBuyer = await BUYER.findById(id).select("-password");
        let userSeller = await SELLER.findById(id).select("-password");
        let userVendor = await VENDOR.findById(id).select("-password");
        if (userBuyer) {
            success = true;
            return res.json({ success, user: userBuyer });
        }
        if (userSeller) {
            success = true;
            return res.json({ success, user: userSeller });
        }
        if (userVendor) {
            success = true;
            return res.json({ success, user: userVendor });
        }
        if (!userBuyer && !userSeller && !userVendor) {
            success = false;
            return res.json({ success, error: "Not Found" });
        }
    } catch (error) {
        console.error(error);
    }
})

// add ratings http://localhost:5000/api/auth/rate/:id
route.post("/rate/:id",upload.none(), async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    try {
        let shop = await SELLER.findById(id);
        if (shop) {
            shop.ratings.push(rating);

            // Recalculate the average rating
            const totalRating = shop.ratings.reduce((sum, r) => sum + r, 0) / shop.ratings.length;
            shop.totalRating = totalRating;

            await shop.save();
            return res.json({ success:true });
        } else {
            shop = await VENDOR.findById(id);
            if (!shop) {
                return res.json({ success:false});
            }
            shop.ratings.push(rating);

            // Recalculate the average rating
            const totalRating = shop.ratings.reduce((sum, r) => sum + r, 0) / shop.ratings.length;
            shop.totalRating = totalRating;

            await shop.save();
            return res.json({ success:true});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong." });
    }
});

// fetch shops http://localhost:5000/api/auth/fetchshop
route.get("/fetchshop", async (req, res) => {
    try {
        let sellers = await SELLER.find();
        let vendors = await VENDOR.find();
        const user = [...sellers, ...vendors];
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
    }
})

// fetch shops http://localhost:5000/api/auth/fetchbyid/:id
route.get("/fetchbyid/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let user = await SELLER.findById(id)
        if (user) {
            return res.json({ success: true, user });
        } else {
            user = await VENDOR.findById(id);
            if (!user) {
                return res.json({ success: false, error: "Not found" })
            }
            return res.json({ success: true, user });
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = route;