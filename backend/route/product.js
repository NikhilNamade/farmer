const express = require("express");
const route = express();
const PRODUCTDATA = require("../model/Productdata");
const PREORDER = require("../model/PreOder");
const BUYER = require("../model/Buyer");
const VENDOR = require("../model/Vendor");
const SELLER = require("../model/Seller");
const fetchuser = require("../middleWare/fetchuser");
let success = false;

const multer = require("multer");
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


//add product http://localhost:5000/api/product/addproduct
route.post("/addproduct",
    upload.fields([{ name: 'productImg', maxCount: 1 }]),
    fetchuser,
    async (req, res) => {
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
            const productImgUrl = await uploadFile(
                req.files["productImg"][0],
                `image-${Date.now()}-${req.files["productImg"][0].originalname}`
            );



            const { productName, price, quantity, unitType, productType } = req.body;
            const ownerId = req.user.id;
            let owner = await SELLER.findById(ownerId);
            if (owner) {
                const data = await PRODUCTDATA.create({
                    productName,
                    ownerName: owner.name,
                    ownerType: owner.userType,
                    price,
                    quantity,
                    ownerId,
                    unitType,
                    productType,
                    productImg: productImgUrl,
                    location: owner.location,
                })
                const savedata = await data.save();
                success = true;
                return res.json({ success, savedata });
            } else {
                owner = await VENDOR.findById(ownerId);
                if (!owner) {
                    res.json({ success: false })
                }
                const data = await PRODUCTDATA.create({
                    productName,
                    ownerName: owner.name,
                    ownerType: owner.userType,
                    price,
                    quantity,
                    ownerId,
                    unitType,
                    productType,
                    productImg: productImgUrl,
                    location: owner.location,
                })
                const savedata = await data.save();
                success = true;
                return res.json({ success, savedata });
            }
        } catch (error) {
            return res.json({ success, error });
        }
    })

//delete product http://localhost:5000/api/product/deleteproduct/:id
route.delete("/deleteproduct/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await PRODUCTDATA.findByIdAndDelete(id);
        success = true;
        res.json({ success });
    } catch (error) {
        console.error(error);
    }
})

//update product http://localhost:5000/api/product/update/:id
route.put("/update/:id", upload.none(), async (req, res) => {
    try {
        const id = req.params.id;
        const { productName, price, quantity, unitType, productType } = req.body;
        const newData = {
            productName,
            price,
            quantity,
            unitType,
            productType
        }

        const updatedData = await PRODUCTDATA.findByIdAndUpdate(id, newData, { new: true, runValidators: true });
        if (!updatedData) {
            success = false;
            return res.json({ success, error: "Not Found" });
        }
        success = true;
        return res.json({ success, updatedData });
    } catch (error) {
        console.error(error);
    }
})
// fetch by product type http://localhost:5000/api/product/fetchbytype/:productType
route.get("/fetchbytype/:productType", async (req, res) => {
    const productType = req.params.productType;
    try {
        const data = await PRODUCTDATA.find({ productType: productType });
        if (!data) {
            return res.json({ success: false, msg: "Data not found" });
        }
        return res.json({ success: true, data });
    } catch (error) {
        console.log(error);
    }
})

// fetch by product type http://localhost:5000/api/product/fetchbyname/:productName
route.get("/fetchbyname/:productName", async (req, res) => {
    const productName = req.params.productName;
    try {
        const data = await PRODUCTDATA.find({ productName: productName });
        if (!data) {
            return res.json({ success: false, msg: "Data not found" });
        }
        return res.json({ success: true, data });
    } catch (error) {
        console.log(error);
    }
})
//fetch http://localhost:5000/api/product/fetch
route.get("/fetch", async (req, res) => {
    try {
        const data = await PRODUCTDATA.find()
        res.json({ success: true, data });
    } catch (error) {
        console.error(error);
    }
})
//fetch by id http://localhost:5000/api/product/fetch/:id
route.get("/fetch/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await PRODUCTDATA.findById(id);
        if (!data) {
            success = false;
            return res.status(404).json({ success, error: "Not Found" });
        }
        return res.json({ data });
    } catch (error) {
        console.error(error);
    }
})




//fetch http://localhost:5000/api/product/fetchuserid
route.get("/fetchuserid", fetchuser, async (req, res) => {
    try {
        const id = req.user.id;
        const data = await PRODUCTDATA.find({ ownerId: id });
        if (!data) {
            success = false;
            return res.status(404).json({ success, error: "Not Found" });
        }
        res.json({ data });
    } catch (error) {
        console.error(error);
    }
})


//fetch http://localhost:5000/api/product/fetchuserid/:id
route.get("/fetchuserid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await PRODUCTDATA.find({ ownerId: id });
        if (!data) {
            success = false;
            return res.status(404).json({ success, error: "Not Found" });
        }
        res.json({ success: true, data });
    } catch (error) {
        console.error(error);
    }
})

//update owner and product location http://localhost:5000/api/product/updatelocation
route.put("/updatelocation", upload.none(), fetchuser, async (req, res) => {
    const { lat, lng } = req.body;
    console.log("location:"+lat + lng)
    try {
        const id = req.user.id;
        let owner = await SELLER.findById(id)
        if (owner) {
            owner.location.lat = lat;
            owner.location.lng = lng;
            const saveowner = await owner.save();

            const product = await PRODUCTDATA.updateMany(
                { ownerId: id },
                { $set: { "location.lat": lat, "location.lng": lng } },
                { runValidators: false } // Disable validation to prevent errors
            );


            return res.json({ success: true, saveowner, product });
        } else {
            owner = await VENDOR.findById(id)
            if (!owner) {
                return res.json({ success: false, msg: "user not found" });
            }
            owner.location.lat = lat;
            owner.location.lng = lng;
            const saveowner = await owner.save();

            const product = await PRODUCTDATA.updateMany(
                { ownerId: id },
                { $set: { "location.lat": lat, "location.lng": lng } },
                { runValidators: false } // Disable validation to prevent errors
            );


            return res.json({ success: true, saveowner, product });
        }
    } catch (error) {
        return res.json({ success: false, error })
    }
})

// preorder http://localhost:5000/api/product/preorder
route.post("/preorder", upload.none(), fetchuser, async (req, res) => {
    const { productId, quantity } = req.body;
    const customerId = req.user.id;
    try {
        let product = await PRODUCTDATA.findById(productId);
        if (!product) {
            return res.json({ success: false, msg: "Product Not Found" });
        }
        if ((product.quantity / 2) < quantity) {
            return res.json({ success: false, msg: "Quantity is Greater than allowed Quantity" });
        }
        let customer = await BUYER.findById(customerId);
        if (customer) {
            const preoder = await PREORDER.create({
                customerName: customer.name,
                customerphNo: customer.phoneNo,
                productName: product.productName,
                productType: product.productType,
                price: product.price,
                unitType: product.unitType,
                productImage: product.productImg,
                ownerId: product.ownerId,
                quantity,
                customerId,
            })
            const savedata = await preoder.save();
            return res.json({ success: true, savedata });
        } else {
            customer = await VENDOR.findById(customerId);
            if (!customer) {
                return res.json({ success: false, msg: "customer Not Found" });
            }
            const preoder = await PREORDER.create({
                customerName: customer.name,
                customerphNo: customer.phoneNo,
                productName: product.productName,
                productType: product.productType,
                price: product.price,
                productImage: product.productImg,
                ownerId: product.ownerId,
                unitType: product.unitType,
                quantity,
                customerId,
            })
            const savedata = await preoder.save();
            return res.json({ success: true, savedata });
        }

    } catch (error) {
        console.log(error);
    }
})

//fethc preorders by user account http://localhost:5000/api/product/fetchpreodersbyconsumer
route.get("/fetchpreodersbyconsumer", fetchuser, async (req, res) => {
    const customerId = req.user.id;
    try {
        const preorders = await PREORDER.find({ customerId });
        if (!preorders) {
            return res.json({ success: false, msg: "No preorder" });
        }
        return res.json({ success: true, preorders })
    } catch (error) {
        console.log(error);
    }
})

//fethc preorders by owner account http://localhost:5000/api/product/fetchpreodersbyowner
route.get("/fetchpreodersbyowner", fetchuser, async (req, res) => {
    const ownerId = req.user.id;
    try {
        const preorders = await PREORDER.find({ ownerId });
        if (!preorders) {
            return res.json({ success: false, msg: "No preorder" });
        }
        return res.json({ success: true, preorders })
    } catch (error) {
        console.log(error);
    }
})

// update status by preorders id http://localhost:5000/api/product/updatestatus/:id
route.put("/updatestatus/:id", upload.none(), async (req, res) => {
    try {
        const { Status } = req.body;
        const id = req.params.id;
        const preorder = await PREORDER.findById(id);
        if (!preorder) {
            return res.json({ success: false, msg: "preorder not found" })
        }
        preorder.Status = Status;
        const savedata = await preorder.save();
        res.json({ success: true, savedata });

    } catch (error) {

    }
})
module.exports = route;