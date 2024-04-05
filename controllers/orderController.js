const order = require("../models/orderModel");
const bankTransaction = require("../models/bankTransactionModel");
const subscriptionsController = require("./vendorSubscriptionController");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const bankTransactionController = require("../controllers/bankTransactionController");
const paymentController = require("../controllers/paymentController");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.createOrder = async (req,res) => {
    const token = req.header("auth-token");
    const decodedToken = jwt.decode(token);
    const userId = decodedToken._id;
  
    try {

    const newOrder = {
      ownerId: userId,
      orderStatus: "Pending",
      orderTotal: req.body.orderTotal,
      orderBusinessId: req.body.orderBusinessId,
      orderItems: req.body.orderItems,
      orderSubscriptionId: req.body.orderSubscriptionId,
      orderDeliveryAddressId: req.body.orderDeliveryAddressId,
      orderType: req.body.orderType
    };
    
    const orderPlaced = await order.create(newOrder);
    
    var payload={
        'body': {
            "transactionDescription": req.body.desc,
            "transactionType": req.body.orderType,
            "transactionAmount": req.body.orderTotal,
            "transactionPgName": req.body.pg,
            "transactionStatus": "Pending",
            'orderId': orderPlaced._id,
            'ownerId': userId,
          }
    };



    try{
      const foundUser = await User.findById(userId);
      var paytmParams={
        "amount": req.body.orderTotal,
        "address": "Sharanpur",
        "email": foundUser.email,
        "firstname": foundUser.firstName,
        "lastname": foundUser.lastName,
        'phone':foundUser.phone,
        'pincode': "247001",
        'orderId': orderPlaced._id,
        'ownerId': userId
      };
    }
    catch(err){
      return res.status(400).send({code:400,message: "Not able to find user data.",data: error});
    }
   

    if(orderPlaced!=null) {
      bankTransactionController.createTransaction(payload).then(async function (trans) {

        if(trans!=null){

            const paytmToken = await paymentController.createTrxnToken(paytmParams);

             console.log("Paytm Token");
             console.log(paytmToken);

            if(paytmToken!=null){
                const result ={ transaction: trans,
                                paytmToken: paytmToken};
    
                return res.status(200).send({code:200, message: "Sucesss", data: result});
            }
            else{
                return res.status(400).send({code:400, message: "Paytm Not able to create order!", data: null});
            }
        }
        else{
            return res.status(400).send({code:400, message: "Not able to create Transaction!", data: null});
        }
        
     });
    }
    else{
      return res.status(400).send({code:400, message: "Not able to create order!", data: null});
    }
 
    

  } catch (error) {
    console.log(error);
  }
};

///This method is for updating the order status
exports.updateOrder = async (orderId,pgResponse) => {
 
  try {

  var filter={transactionOrderId:orderId};

  var updatedTransaction={
    transactionStatus: pgResponse.transactionStatus,
    transactionRespMsg: pgResponse.transactionRespMsg
  };

  var transaction = await bankTransaction.findOneAndUpdate(filter, updatedTransaction);

  if(transaction!=null){
    const foundOrder = await order.findOne({_id: orderId});

    foundOrder.update({orderStatus: pgResponse.transactionStatus});

    if(foundOrder!=null){

    if(foundOrder.orderStatus=="Pending" || foundOrder.orderStatus=="Delay"){
     const userId=foundOrder.ownerId;


    if(transaction.transactionType=="Subscription" && pgResponse.transactionStatus == "Completed"){

      const newSubData = {
        ownerId: userId,
        planStatus: "Active",
        orderId: orderId
       };
 
      var planId=foundOrder.orderSubscriptionId;

      var subData = subscriptionsController.getCurrentSubscription(userId);

      if(subData!=null){
        
        if(planId!=null){
          ///Plan is available
          var result= await subscriptionsController.updateSubscriptionRechargeDate(planId,newSubData); 
          console.log("Added Subscription"+result);
          return result;

         }
         else{
          ///Plan is not available
          console.log("Plan not found");
         }

        
    
      }
      else{
       ///First Recharge
       if(planId!=null){
       var addedSub=await subscriptionsController.addNewSubscription(planId,newSubData);
       console.log("Added RECAHRGE"+addedSub);
       return addedSub;
       }
       else{
        console.log("Plan not found");
       }
       

      }
       
      
     
    }
    else if(transaction.transactionType=="Order"){
      console.log("Transaction type order not handeled yet");
    }
    else{
      console.log("default transaction case not handeled yet");
    }

      }
      else{
        //Transaction is not having Pending status

        const response = {
          message: "Transaction cant be chceked for status"
         };

       return response;
      }

    


    }
    else{
      console.log("Order not found: " + orderId);
    }

  }
   
    
  }
  catch (error) {
      console.log(error.message);
  }

}


exports.getTransaction = async (req, res) => {
  try {
    const foundtransaction = await bankTransaction.findOne({transactionRefId: req.body.txnId }); //returns the first document that matches the query criteria or null
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

};


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


exports.paytmToken=async (req,res) => {


  // console.log(req.body);

  var paytmParams={
    "amount": req.body.ordertotal,
    "address": req.body.address,
    "email": req.body.email,
    "firstname":req.body.firstname,
    "lastname": req.body.lastname,
    'phone':req.body.phone,
    'pincode': req.body.pincode,
    'orderId': req.body.orderId,
    'ownerId': req.body.ownerId
  };

  try{
    const paytmToken = await paymentController.createTrxnToken(paytmParams);

         console.log("Paytm Token");
         console.log(paytmToken);

        if(paytmToken!=null){
            const result ={ aytmToken: paytmToken};

            return res.status(200).send({code:200, message: "Sucesss", data: result});
        }
        else{
            return res.status(400).send({code:400, message: "Paytm Not able to create order!", data: null});
        }
  }catch(e){
     console.log(e);
  }


};




