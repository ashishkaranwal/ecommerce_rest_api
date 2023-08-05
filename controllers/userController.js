const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const User = require("../models/userModel");
const { registerValidation, loginValidation } = require("../middleware/validation");
const JWT_KEY = "qwerty1234567890";


// signup
exports.signUp = async (req, res, next) => {
  const { error, value } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
  if (emailExist) return res.status(400).send({ message: "Email already exist!" });

  try {
    const newUser = await createUserObj(req);
    const savedUser = await User.create(newUser);
    return res.status(200).send({ message: "User created successfully!", user: savedUser });
  } catch (err) {
    return res.status(400).send({ error: "User created successfully!", error: err });
  }
};

// login
exports.logIn = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
  if (!foundUser) return res.status(400).send({ message: "invalid login credential" });

  try {
    const isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
    if (!isMatch) return res.status(400).send({ message: "invalid login credential" });
     
    const token = await jwt.sign({ _id: foundUser._id }, JWT_KEY);

    return res.status(200).header("auth-token", token).send({ "auth-token": token, userId: foundUser._id });

  } catch (error) {
    return res.status(400).send(error);
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
   // req.body.password = bcrypt.hashSync(req.body.password, 10); //encrypt the password before updating
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

    if (!updatedUser) {
      return res.status(400).send({ message: "Could not update user" });
    }
    return res.status(200).send({ message: "User updated successfully", updatedUser });

  } catch (error) {
   // "An error has occurred, unable to update user"

   console.log(error.message);

    return res.status(400).send({ error:  "An error has occurred, unable to update user"});
  }
};


// Update user password
exports.updateUserPassword = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10); //encrypt the password before updating
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

    if (!updatedUser) {
      return res.status(400).send({ message: "Could not update user password" });
    }
    return res.status(200).send({ message: "User password updated successfully" });

  } catch (error) {

    return res.status(400).send({ error:  "An error has occurred, unable to update user password"});
  }
};



// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId); // the `await` is very important here!

    if (!deletedUser) {
      return res.status(400).send({ message: "Could not delete user" });
    }
    return res.status(200).send({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    return res.status(400).send({ error: "An error has occurred, unable to delete user" });
  }
};

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
  };
}
