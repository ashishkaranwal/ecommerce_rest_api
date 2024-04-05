const address = require("../models/addressModel");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.addAddress = async (req,res) => {
  try {

    const newAddress = {
      streetAddress: req.body.transactionDescription,
    };
    
    const address = await address.create(newAddress);

    if(address!=null)
      return  res.status(200).send({code:200,message: "New Address added", data: address});

    return  res.status(400).send({code:400,message: "New Address not added", data: null});
    
  } catch (error) {
    return  res.status(400).send({code:400,message: "Something went wrong while adding address.", data: error});
  }
};


exports.getAddress = async (req, res) => {
  try {
    const address = await bankTransaction.findOne({transactionRefId: req.body.txnId }); //returns the first document that matches the query criteria or null
    if (!foundtransaction) return res.status(400).send({ message: "Invalid txn id" });

    return res.status(200).send({code:200,message: "success", data: foundtransaction});

  } catch (error) {
    return res.status(400).send({code:400,message: "Error",data: error});
  }

};



exports.updateTransaction = async (updatedata,tid) => {
  const filter = {transactionRefId: tid};
  try {
      await bankTransaction.findOneAndUpdate(filter, updatedata).then((transaction) => {

        if(transaction.transactionType=="VendorRecharge"){
          
          const dataToUpdate = {
            vendorCurrentPlan: updatedata.transactionStatus,
            vendorActivePlanExipry: updatedata.transactionRespMsg
          };


          ///Update vendor data
          vendorController.updateVendor(dataToUpdate, transaction.transactionOwnerId);
        }
          return {code:200,message: "Transaction Completed",data: transaction};
       });
  }
  catch (error) {
    return {code:400,message: "Something went wrong",data: error};
  }

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

