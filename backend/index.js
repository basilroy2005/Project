const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const authenticateToken = require('./middleware/authenticateToken');
app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://basilroy:basilroy@cluster0.ubfflww.mongodb.net/e-commerce")


    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

    app.get("/",(req,res) => {
    res.send("Express App is Running")
})
// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Creating upload endpoint
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

const Product = mongoose.model('Product', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

app.post("/addproduct", async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        } else {
            id = 1;
        }
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        console.log(product)
        await product.save();
        console.log("Product Added Successfully");
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Product Removed Successfully");
        res.json({
            success: true,
            id: req.body.id
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: "Error removing product" });
    }
});

app.get("/allproducts", async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("Products fetched");
        res.send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
});


//Schemaa creating for user model

const Users = mongoose.model('Users',{
firstName: { type: String, default: '' },
lastName: { type: String, default: '' },
profilePicture: { type: String, default: '' },
email: { type: String, unique: true },
username: { type: String, default: '' },
password: { type: String },
city: { type: String, default: '' },
phonenumber: { type: String, default: '' },
dateOfBirth: { type: String, default: '' },
gender: { type: String, default: '' },
additionalFeatures: { type: String, default: '' },
cartData: { type: Object },
date: { type: Date, default: Date.now },
})

// Update profile route
app.put("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    profilePicture,
    username,
    city,
    phonenumber,
    dateOfBirth,
    gender,
    additionalFeatures
  } = req.body;

  const user = await Users.findById(userId);
  if (!user) return res.status(404).send("User not found");

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;
  if (username !== undefined) user.username = username;
  if (city !== undefined) user.city = city;
  if (phonenumber !== undefined) user.phonenumber = phonenumber;
  if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
  if (gender !== undefined) user.gender = gender;
  if (additionalFeatures !== undefined) user.additionalFeatures = additionalFeatures;
  await user.save();

  // Issue a new token with updated name
  const newToken = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    'secret_ecom',
    { expiresIn: "1h" }
  );

  res.json({ message: "Profile updated", token: newToken, user });
});

//Creating endpoint for registering the user

app.post('/signup',async (req,res)=>{

let check = await Users.findOne({email:req.body.email})
if (check)
{
    return res.status(400).json({success:false,errors:"existing user found with same email address"})
}
let cart ={}
for (let i = 0; i < 300; i++) {
    cart[i]=0;
    
}const user= new Users({

name:req.body.username,
email:req.body.email,
password:req.body.password,
cartData:cart,
})
await user.save();

const data ={
    user:{
        id:user.id
    }
}

const token = jwt.sign(data,'secret_ecom');
res.json({success:true,token})

})

//creating endpoint for user login
app.post('/login',async (req,res)=>{
let user = await Users.findOne({email:req.body.email})
if (user) 
{
    const passCompare = req.body.password ===user.password
    if(passCompare){
        const data ={
            user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

}
else{
    res.json({success:false,errors:"Wrong Password"})
}
}
else{
    res.json({success:false,errors:"Wrong Email Id"})
}
})

//creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
const token=req.header('auth-token');
if (!token) {
    res.status(401).send({errors:"Please authenticate using valid token"})
    
}
else{
    try {
        const data = jwt.verify(token,'secret_ecom')
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
}
}

//creating endpoint for adding products in cart
app.post('/addtocart',fetchUser, async (req,res)=>{
console.log("Added",req.body.itemId)
let userData= await Users.findOne({_id:req.user.id});
userData.cartData[req.body.itemId] += 1;
await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
res.send("Added")
})

//creating endpoint to remove product from cart
app.post('/removefromcart',fetchUser, async (req,res)=>
{
    console.log("removed",req.body.itemId)
    let userData= await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
userData.cartData[req.body.itemId] -= 1;
await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
res.send("Removed")
})

//creating endpoint for getting cartdata

app.post('/getcart',fetchUser, async (req,res)=>{
console.log("GetCart")
let userData = await Users.findOne({_id:req.user.id})
res.json(userData.cartData)
})


// Endpoint to get user profile data
app.get('/getprofile', fetchUser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Error fetching user profile' });
    }
});


app.post('/updateproduct', async (req, res) => {
    try {
        const { id, name, old_price, new_price, category, image } = req.body;
        const updated = await Product.findOneAndUpdate(
            { id: id },
            {
                name,
                old_price,
                new_price,
                category,
                image
            },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product: updated });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Error updating product' });
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
