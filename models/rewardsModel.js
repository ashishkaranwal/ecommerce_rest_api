const mongoose = require("mongoose");
const rewardsSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    applicableOn: {
      type: String,
      required: true
    },
    type: {
        type: String,
        required: true
    },
    levelName: {
        type: String,
        required: false
    }
  },
  { timestamps: true} //to include createdAt and updatedAt
);

module.exports = mongoose.model("Rewards", rewardsSchema);
