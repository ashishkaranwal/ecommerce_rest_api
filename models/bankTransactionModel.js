const mongoose = require("mongoose");
const bankTransactionSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    transactionDescription: {
      type: String,
      trim: true,
      required: true,
    },
    transactionType: {
        type: String,
        trim: true,
      required: true,
    },
    transactionAmount: {
        type: Number,
        required: true,
      },
    transactionPgName: {
        type: String,
        required: true,
      },
    transactionRefId: {
        type: String,
      },
    transactionStatus: {
        type: String,
        required: true,
      },
      transactionOrderId: {
        type: String,
        required: false,
        default: null,
      },
      transactionRespMsg: {
        type: String,
        required: false,
        default: null,
      },

  },
  { timestamps: true } //to include createdAt and updatedAt
);

module.exports = mongoose.model("BankTransaction", bankTransactionSchema);
