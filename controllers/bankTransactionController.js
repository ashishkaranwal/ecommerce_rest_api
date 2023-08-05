const bankTransaction = require("../models/bankTransactionModel");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.createTransaction = async (req, res, next) => {
  try {

    const newTransaction = {
      transactionDescription: req.body.desc,
      transactionType: req.body.type,
      transactionAmount: req.body.amount,
      transactionPgName: req.body.pg,
      transactionStatus: req.body.status,
      transactionOwnerId: req.body.owner,
      transactionOwnerType: req.body.ownerType,
    };
    
    const transaction = await bankTransaction.create(newTransaction);
    return res.status(200).send({ message: "Transaction created successfully!", transaction });
  } catch (error) {
    return res.status(400).send({ message: "unable to create transaction", error });
  }
};



exports.updateTransaction = async (req, res, next) => {
  const filter = { _id: req.body.id };
  await bankTransaction.findByIdAndUpdate(filter, update);
}


exports.getPlans = (req, res, next) => {
  const query = {
    //skip = size * (pageNo - 1),
    //limit = size,
  };

  VendorPlan.find({}, {}, query)
    .select("-_id -__v -updatedAt")
    .exec((err, plans) => {
      if (err) return res.status(400).send({ message: "showing order", err });
      return res.status(200).send({code:200, message: "showing all plans", data: plans });
    });
};

