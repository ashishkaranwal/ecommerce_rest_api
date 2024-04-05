const mongoose = require("mongoose");
const userWalletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: String,
      required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Active'
      }
  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("UserWallet", userWalletSchema);
