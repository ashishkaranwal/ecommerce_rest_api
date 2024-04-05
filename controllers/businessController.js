const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Business = require("../models/businessModel");
const { addBusinessValidation } = require("../middleware/validation");
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


// add Business
exports.addBusiness = async (req, res, next) => {
  const { error, value } = addBusinessValidation(req.body);
  if (error) return res.status(400).send({code:400,message:error.details[0].message,data:null});

  const businessExist = await Business.findOne({ phone: req.body.phone }); //returns the first document that matches the query criteria or null
  if (businessExist) return res.status(400).send({code:400, message: "Business with same phone number already exist!" ,data:null});

  try {
    const newBusiness = await createBusinessObj(req);
    const savedBusiness = await Business.create(newBusiness);
    return res.status(200).send({ code:200,message: "Business added successfully!", data: savedBusiness });
  } catch (err) {
    return res.status(400).send({ code:400,message: err.message, data: err});
  }
};



// Update business
exports.updateBusiness = async (req, res) => {
  try {

    const businessId = req.body.businessId;

   // req.body.password = bcrypt.hashSync(req.body.password, 10); //encrypt the password before updating
    const updatedBusiness = await Business.findByIdAndUpdate(businessId, { $set: req.body }, { new: true });

    if (!updatedBusiness) {
      return res.status(400).send({code:400, message: "Could not update business" ,data:null});
    }
    return res.status(200).send({ code:200,message: "Business updated successfully", data: updatedVendoruser});

  } catch (error) {
   // "An error has occurred, unable to update user"
    return res.status(400).send({ code:400,error:  "An error has occurred, unable to update business",data:null});
  }
};



// Get business Info
exports.getBusinessInfo = async (req, res) => {
  try {
    const businessId = req.body.businessId;

    const foundBusiness = await Business.findById(businessId); //returns the first document that matches the query criteria or null
    if (!foundBusiness) return res.status(400).send({code:400,message: "Invalid business id",data:null});
    return res.status(200).send({code:200,message: "Success", data: foundBusiness,});

  } catch (error) {
    return res.status(400).send(error);
  }

};


// Update business profile pic
exports.updateBusinessProfilePic = async (req, res) => {
  try {
    const businessId = req.body.businessId;
    
     var newData = {'businessProfilePic': `images/business/profile_pics/${req.file.originalname}`};

     const storageRef = ref(storage, `images/vendors/profile_pics/${req.file.originalname}`);

     uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
        console.log(snapshot.metadata.fullPath);
      });


     if(req.file==null){
      return res.status(400).send({code:400, message: "Could not update business profile pic" ,data:null});
     }

    const updatedBusiness = await Business.findByIdAndUpdate(businessId, { $set: newData }, { new: true });

    if (!updatedBusiness) {
      return res.status(400).send({code:400, message: "Could not update business profile pic" ,data:null});
    }
    return res.status(200).send({ code:200,message: "Business profile pic updated successfully", data: newData});

  } catch (error) {

    return res.status(400).send({ code:400,error:  "An error has occurred, unable to update business",data:null});
  }
};




const createBusinessObj = async (req) => {
  return {
    phone: req.body.lastName,
    businessName: req.body.email,
    businessAddress: bcrypt.hashSync(req.body.password, 10),
    businessCity: req.body.phone,
    businessState: req.body.businessState,
    businessPincode: req.body.businessPincode,
    businessCordinates: req.body.businessCordinates
  };
}
