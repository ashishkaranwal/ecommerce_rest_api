const mongoose = require("mongoose");
const businessSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    ownerId: {
      type: String,
      trim: true,
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
      businessProfilePic: {
        type: String,
        trim: true,
      },
      businessBannerPic: {
        type: String,
        trim: true,
      },
      businessStatus: {
        type: String,
        trim: true,
        default: 'Active'
      }
  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("Business", businessSchema);
