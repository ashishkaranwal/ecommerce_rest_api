const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const paymentController= require("./paymentController");

const User = require("../models/userModel");
const { registerVendorValidation, loginValidation } = require("../middleware/validation");
const JWT_KEY = "qwerty1234567890";

const firebsae = require("firebase/app");
const { getStorage, ref, uploadBytes } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBr-9ITcD0V6CPZ5zsdBV-yhXR2sav0A2w",
  authDomain: "hikesmoney-25fed.firebaseapp.com",
  projectId: "hikesmoney-25fed",
  storageBucket: "hikesmoney-25fed.appspot.com",
  messagingSenderId: "179956416948",
  appId: "1:179956416948:web:6424c6ec92c850ccdef2e1",
  measurementId: "G-XE657TPKH8"
};



firebsae.initializeApp(firebaseConfig);

const storage = getStorage();


function randomString(len) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'');
}

async function getReffCode() {
  try{
    const reffCode = randomString(8);
    const codeExist = await User.findOne({refferalCode: reffCode});
    if(!codeExist){
      return reffCode;
    }
    else{
      getReffCode();
    }

  }catch(err){
  }
};

// signup
exports.signUp = async (req, res, next) => {
  const { error, value } = registerVendorValidation(req.body);
  if (error) return res.status(400).send({code:400,message:error.details[0].message,data:null});

  const emailExist = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
  if (emailExist) return res.status(400).send({code:400, message: "Vendor with same Email already exist!" ,data:null});

  try {
    const code = await getReffCode();
    const newVendorUser = await createVendorObj(req,code);
    const savedVendorUser = await User.create(newVendorUser);
    return res.status(200).send({ code:200,message: "Vendor registered successfully!", data: savedVendorUser });
  } catch (err) {
    return res.status(400).send({ code:400,message: err.message, data: err});
  }
};




// login
exports.logIn = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundVendorUser = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
  if (!foundVendorUser) return res.status(400).send({ code: 400,message: "Invalid login credential",data: null});

  try {
    const isMatch = await bcrypt.compareSync(req.body.password, foundVendorUser.password);
    if (!isMatch) return res.status(400).send({code:400, message: "Invalid Password",data:null });
     
    const token = await jwt.sign({ _id: foundVendorUser._id }, JWT_KEY);

    return res.status(200).header("auth-token", token).send({ code:200,message:"Vendor logged In",data:{"auth-token": token, profileData: foundVendorUser}});

  } catch (error) {
    return res.status(400).send(error);
  }
};

// Update user
exports.updateVendor = async (req, res) => {
  try {

    const token = req.header("auth-token");
    const decodedToken = jwt.decode(token);
    const userId = decodedToken._id;

   // req.body.password = bcrypt.hashSync(req.body.password, 10); //encrypt the password before updating
    const updatedVendoruser = await User.findByIdAndUpdate(userId, {$set: req.body }, { new: true });

    if (!updatedVendoruser) {
      return res.status(400).send({code:400, message: "Could not update vendor" ,data:null});
    }

    return res.status(200).send({ code:200,message: "Vendor updated successfully", data: updatedVendoruser});

  } catch (error) {
   // "An error has occurred, unable to update user"
    return res.status(400).send({ code:400,error:  "An error has occurred, unable to update user",data:null});
  }
};


// Update user password
exports.updateVendorPassword = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10); //encrypt the password before updating
    const updatedVendor = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

    if (!updatedVendor) {
      return res.status(400).send({ message: "Could not update user password" });
    }
    return res.status(200).send({ message: "Vendor password updated successfully" });

  } catch (error) {

    return res.status(400).send({ error:  "An error has occurred, unable to update user password"});
  }
};



// Delete user
exports.deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await User.findByIdAndDelete(req.params.userId); // the `await` is very important here!

    if (!deletedVendor) {
      return res.status(400).send({ message: "Could not delete user" });
    }
    return res.status(200).send({ message: "Vendor deleted successfully", user: deletedVendor });
  } catch (error) {
    return res.status(400).send({ error: "An error has occurred, unable to delete user" });
  }
};

// Get user profile Info
exports.profile = async (req, res) => {
  try {
    const token = req.header("auth-token");
    const decodedToken = jwt.decode(token);
    console.log(decodedToken._id);

    const foundVendor = await User.findById(decodedToken._id); //returns the first document that matches the query criteria or null
    if (!foundVendor) return res.status(400).send({code:400,message: "invalid user id",data:null});

    console.log(foundVendor);
    return res.status(200).send({code:200,message: "success", data: foundVendor,});

  } catch (error) {
    return res.status(400).send(error);
  }

};


// Update user profile pic
exports.updateVendorProfilePic = async (req, res) => {
  try {
   
    console.log(req.path);

    const token = req.header("auth-token");
    const decodedToken = jwt.decode(token);

    
     var newData = {'profilePic': `images/vendors/profile_pics/${req.file.originalname}`};

     const storageRef = ref(storage, `images/vendors/profile_pics/${req.file.originalname}`);

     uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
        console.log(snapshot.metadata.fullPath);
      });


     if(req.file==null){
      return res.status(400).send({code:400, message: "Could not update user profile pic" ,data:null});
     }

   // req.body.password = bcrypt.hashSync(req.body.password, 10); //encrypt the password before updating
    const updatedVendor = await Vendor.findByIdAndUpdate(decodedToken._id, { $set: newData }, { new: true });

    if (!updatedVendor) {
      return res.status(400).send({code:400, message: "Could not update user profile pic" ,data:null});
    }
    return res.status(200).send({ code:200,message: "Vendor profile pic updated successfully", data: newData});

  } catch (error) {
   // "An error has occurred, unable to update user"

   console.log(error.message);

    return res.status(400).send({ code:400,error:  "An error has occurred, unable to update user",data:null});
  }
};



async function getUserParentId(referralCode){
  try {
    const foundUser = await User.findOne({referralCode: referralCode}).select('referralCode referredBy _id'); //returns the first document that matches the query criteria or null
    if (!foundUser) console.log("No User Found");
    return foundUser;

  } catch (error) {
   console.log(error);
  }

};

exports.fetchParents = async (req, res) => {
  try {
    console.log("Fetching parents");
    const foundUser = await User.findById(req.body.userId); //returns the first document that matches the query criteria or null
    if (!foundUser) console.log("No User Found");
    const ancesstors = [];

    var trgtCode = foundUser.referredBy;

    do {
    var parentData=await getUserParentId(trgtCode);
    if(parentData!=null){
      ancesstors.push(parentData._id);
      trgtCode=parentData.referredBy;
    }
    }
    while (trgtCode == "Self");
    
  
    return res.status(200).send({message: "success", data: ancesstors});

  } catch (error) {
    return res.status(400).send(error);
  }

};


exports.updateVendor = async (dataToUpdate,vid) => {
  try {
    const updatedVendorUser = await user.findByIdAndUpdate(vid, { $set: dataToUpdate.body }, { new: true });
    if (!updatedVendorUser) {
      return false;
    }
    return true;

  } catch (error) {
    return false;
  }
};


exports.getPaymentStatus = async (req, res) => {
  try {
    const order = req.body.orderId;

    const status = await paymentController.getPaymentStaus(order); //returns the first document that matches the query criteria or null
   
    console.log(status);
    
    return res.status(200).send({code: 200,message: "status",data: status});

  } catch (error) {
    return res.status(400).send(error);
  }

};



const createVendorObj = async (req,reffCode) => {
  return {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isVendor: true,
    referralCode: reffCode,
    referredBy: req.body.referralCode??"Self"
  };
}
