const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    streetAddress: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      default: "India"
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
      },
    phone: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    isDefault: {
      type: Boolean,
      required: true,
      default: false
    },
    ownerId: {
      type: String,
      required: true
    }
  },
  { timestamps: true } //to include createdAt and updatedAt
);
module.exports = mongoose.model("Address", addressSchema);
