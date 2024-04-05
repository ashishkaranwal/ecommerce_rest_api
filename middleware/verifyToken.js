const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
const MASTER_KEY = process.env.MASTER_KEY;

const User = require("../models/userModel");

const verifyUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(400).send("access denied");
  
    try {
      const verifiedUser = jwt.verify(token, JWT_KEY);
      req.user = verifiedUser;
      next();
    } catch (err) {
      res.status(400).send("invalid token");
    }
};

const verifyAdmin = (req, res, next) => {
    const token = req.header("admin-token");
    if (!token) return res.status(400).send("access denied");
  
    try {
      const verifiedAdmin = jwt.verify(token, MASTER_KEY);
      req.admin = verifiedAdmin;
      next();
    } catch (err) {
      res.status(400).send("invalid token");
    }
};


const verifyVendor = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(400).send("access denied");

  try {
    const verifiedUser = jwt.verify(token, JWT_KEY);
    req.user = verifiedUser;

    const foundUser = await User.findById(verifiedUser._id);
    if(foundUser.isVendor){
      next();
     }
     else{
      res.status(400).send("User is not registered as a vendor");
     }
  } catch (err) {
    res.status(400).send("invalid token");
  }
};

const checkIfVendor = async (req, res, next) => {
    const token = req.header("auth-token");
    const decodedToken = jwt.decode(token);
    const userId=decodedToken._id;

   const foundUser = await User.findById(userId); 
    if (!foundUser){
       if(foundUser.roles.includes("Vendor")){
        next();
       }
       else{
        res.status(400).send("User is not registered as a vendor");
       }
    }
};




module.exports = { verifyUser, verifyAdmin,verifyVendor }