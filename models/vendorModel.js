const { boolean } = require("joi");
const mongoose = require("mongoose");
const vendorSchema = new mongoose.Schema(
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
    businessName: {
        type: String,
        trim: true,
        required: true,
      },
    businessAddress: {
        type: String,
        trim: true,
        required: true,
      },
      businessCity: {
        type: String,
        trim: true,
        required: true,
      },
      businessState: {
        type: String,
        trim: true,
        required: true,
      },
      businessPincode: {
        type: Number,
        trim: true,
        required: false,
      },
      businessCordinates: {
        type: String,
        trim: true,
        required: false,
      },
      businessBanner: {
        type: String,
        trim: true,
        required: false,
      },
      businessProfilePic: {
        type: String,
        trim: true,
        required: false,
      },
      phoneVerified: {
        type: Boolean,
        default: false,
      },
      resetPasswordLink: {
        data: String,
        default: '',
      },
      profilePic: {
        type: String,
        trim: true,
      },
      businessBannerPic: {
        type: String,
        trim: true,
      },
      vendorCurrentPlan: {
        type: String,
        trim: true,
        required: true,
        default: "Initial"
      },
      vendorActivePlanExipry: {
        type: String,
        trim: true,
        required: true,
        default: Date.now().toString()
      },

  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("Vendor", vendorSchema);
