const mongoose = require("mongoose");
const vendorSubscriptionSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    ownerId: {
      type: String,
      trim: true,
      required: true,
    },
    nextRechargeDate: {
      type: Date,
      required: true,
    },
    planStatus: {
        type: String,
        required: true,
      },
    orderId: {
        type: String,
        required: true,
      }
  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("VendorSubscription", vendorSubscriptionSchema);
