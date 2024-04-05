const mongoose = require("mongoose");
const walletTransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    walletId: {
      type: String,
      required: true
    },
    type: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    }
  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
