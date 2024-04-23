const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModal");
const Admin = require("../models/admin");
const { green } = require("colors");
const genarateToken = require("../config/genarateToken");


const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  if (orders) {
    console.log("Product fetched!!!".green.bold);
    //send data to frontend in json format
    res.send(orders);
  } else {
    console.log("Failed fetch products !!!".red.bold);
    //send error message to frontend
    res.status(400).json({
      error: "Failed to fetch products !!!",
    });
    throw new error("Failed to fetch products !!!");
  }
});

const confirmOrder = asyncHandler(async (req, res) => {

  const {id} = req.body;

  const order = await Order.findByIdAndUpdate(id, {
    orderStatus:"Confirmed",
  });

  if (order) {
    console.log("Order Confirmed!!!".green.bold);
    //send data to frontend in json format
    res.send(order);
  } else {
    console.log("Failed to confirm order !!!".red.bold);
    //send error message to frontend
    res.status(400).json({
      error: "Failed to confirm order !!!",
    });
    throw new error("Failed to confirm order !!!");
  }
});

const adminAuth = asyncHandler(async (req, res) => {
  
  //getting body data
  const { userName, password } = req.body;

  console.log(userName,password);
  //check if user available in database
  const admin = await Admin.findOne({ userName });
  if(!userName){
    return res.status(400).send({ message: "Invalid User Name" });
  }
  if (!(await admin.matchPassword(password)))
    return res.status(400).send({ message: "Incorrect Password " });


  //if user available send response with matching password and genarate JWT token using user id
  if (admin && (await admin.matchPassword(password))) {
    res.status(200).json({
      userName: admin.userName,
      token: genarateToken(admin._id),
    });
  } else {
    //send error message to frontend
    console.log("Invalid user name or Password".red.bold);
    res.status(400).json({
      error: "Incorrect password !!!",
    });
    throw new error("Incorrect password !!!");
  }
});

const addAdmin = asyncHandler(async (req, res) => {
  //getting body data
  const { userName, password} = req.body;

  //backend validation for body data
  if (!userName || !password) {
    res.send(400);
    throw new error("Please enter all the fields!!!");
  }

  //find if user exist with email and user name
  const adminExist = await Admin.findOne({ userName });

  //sending error message if user exist
  if (adminExist) {
    console.log("Admin already exist!!!".red.bold);
    res.status(400).json({
      error: "Admin already exist !!!",
    });
    throw new error("Admin already exist!!!");
  }

  //create new user in database
  const admin = await Admin.create({
    userName,
    password,
  });

  //send response to frontend
  if (admin) {
    console.log("Registered!!!".green.bold);
    res.status(201).json({
      _id: admin._id,
      userName: admin.userName,
      token: genarateToken(admin._id),
    });
  } else {
    //send error message to frontend
    console.log("Failed to Register Admin !!!".red.bold);
    res.status(400).json({
      error: "Failed to Register Admin !!!",
    });
    throw new error("Failed to Register Admin !!!");
  }
});

module.exports = {
  getAllOrders,
  confirmOrder,
  adminAuth,
  addAdmin,
};
