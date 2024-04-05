const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    ownerId: {
      type: String,
      trim: true,
      required: true,
    },
    orderStatus: {
        type: String,
        trim: true,
      },
     orderTotal:{
        type: Number,
        trim: true,
        required: true,
      },
    orderBusinessId:{
        type: String,
        trim: true
      },
    orderItems:{
        type: [String],
      },
    orderSubscriptionId:{
        type: String,
        trim: true
      },
      orderDeliveryAddressId:{
        type: String,
        trim: true
      },
      orderType:{
        type: String,
        trim: true,
        required: true
      }
  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
