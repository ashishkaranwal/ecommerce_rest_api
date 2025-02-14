const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    isVendor: {
      type: Boolean,
      required: true,
      default: false
    },
    isCm: {
      type: Boolean,
      required: true,
      default: false
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
    referralCode: {
      type: String,
      required: true
    },
    referredBy: {
      type: String,
      default: 'Self'
    }
  },
  { timestamps: true } //to include createdAt and updatedAt
);
module.exports = mongoose.model("User", userSchema);
