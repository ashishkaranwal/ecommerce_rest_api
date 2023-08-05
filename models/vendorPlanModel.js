const mongoose = require("mongoose");
const vendorPlanSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    planName: {
      type: String,
      trim: true,
      required: true,
    },
    planValidity: {
      type: Number,
      required: true,
    },
    planPrice: {
        type: Number,
        required: true,
      }
  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("VendorPlan", vendorPlanSchema);
