const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const wallet = require("../models/userWallet");
const walletTransaction = require("../models/walletTransaction");

const JWT_KEY = "qwerty1234567890";


// add transaction
exports.addNewTransaction = async (userId,payload) => {
  try {
    const walletExist = await wallet.findOne({ownerId: userId}); //returns the first document that matches the query criteria or null
    if (walletExist){
      //We can add a new transaction
      payload.walletId = walletExist._id;
      const savedTransaction = await walletTransaction.create(payload);
      if(!savedTransaction) return null;

      await updateWalletBalance(userId,payload.type,payload.amount);
      return savedTransaction;
    }
    else{
      //Add a new wallet first and then add transaction
      const newWallet = await addNewWallet(userId);
      payload.walletId = newWallet._id;
      const savedTransaction = await walletTransaction.create(payload);
      if(!savedTransaction) return null;
      await updateWalletBalance(userId,payload.type,payload.amount);
      return savedTransaction;
    }
    
  } catch (err) {
   console.log("Wallet Transaction not added : "+ err);
  }
 
};

async function addNewWallet(userId) {
    const walletExist = await wallet.findOne({ownerId: userId}); //returns the first document that matches the query criteria or null
    if (walletExist){
       return walletExist;
    }
    else{
        var newWalletData ={
            ownerId: userId,
            balance:0,
            status: 'Active'
        };
        const savedWallet = await wallet.create(newWalletData);
        return savedWallet;
    }
}

async function updateWalletBalance(userId,type,amount) {
  const walletExist = await wallet.findOne({ownerId: userId}); //returns the first document that matches the query criteria or null
  if (walletExist){
    if(type =="credit"){
      walletExist.balance = walletExist.balance + amount;
    }
    else if(type =="debit"){
      walletExist.balance = walletExist.balance - amount;
    }
      walletExist.save();
     return walletExist;
  }
  else{
      console.log("wallet not found");
  }
}






// Update user password
// exports.updateUserPassword = async (req, res) => {
//   try {
//     req.body.password = bcrypt.hashSync(req.body.password, 10); //encrypt the password before updating
//     const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

//     if (!updatedUser) {
//       return res.status(400).send({ message: "Could not update user password" });
//     }
//     return res.status(200).send({ message: "User password updated successfully" });

//   } catch (error) {

//     return res.status(400).send({ error:  "An error has occurred, unable to update user password"});
//   }
// };





// Get user profile Info
exports.profile = async (req, res) => {
  try {
    const foundUser = await User.findOne({email: req.params.email }); //returns the first document that matches the query criteria or null
    if (!foundUser) return res.status(400).send({ message: "invalid user id" });

    console.log(foundUser);
    return res.status(200).send({message: "success", userData: foundUser});

  } catch (error) {
    return res.status(400).send(error);
  }

};

const createUserObj = async (req) => {
  return {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    roles: req.body.roles
  };
}
