const VendorSubscription = require("../models/vendorSubscriptionModel");
const vendorPlanController = require("../controllers/vendorPlansController");
const jwt = require("jsonwebtoken");


exports.addNewSubscription = async (planId,payload) => {
  try {

    const newSub = {
          ownerId: payload.ownerId,
          nextRechargeDate: "",
          planStatus: payload.planStatus,
          orderId: payload.orderId,
    };

    console.log(newSub);

    var plan = await vendorPlanController.getPlan(planId);

    if(plan!=null){
     const validity = plan.planValidity;
     console.log(validity);
     var today = new Date();
     var rechargeDate = new Date();
     rechargeDate.setDate(today.getDate()+validity);
     console.log("Recharge date -> " + rechargeDate);
     newSub.nextRechargeDate = rechargeDate;
    
    const subAdded = await VendorSubscription.create(newSub);
    return subAdded;
    }
    else{
      console.error("Couldn't find plan with id " + planId);
    }
  } catch (error) {
   console.log(error);
  }
};


exports.updateSubscriptionRechargeDate = async (planId,payload) => {
    try {

        const newSubData = {
            planStatus: payload.planStatus,
            nextRechargeDate: payload.nextRechargeDate,
            orderId: payload.orderId};


        var plan = await vendorPlanController.getPlan(planId);

       if(plan!=null){
        const validity = plan.planValidity;


        console.log(validity);

        var today = new Date();
        var rechargeDate = new Date();
        rechargeDate.setDate(today.getDate()+validity);

        console.log("Recharge date -> " + rechargeDate);

        newSubData.nextRechargeDate = rechargeDate;

        const filter = {ownerId: payload.ownerId};
        const subDataAdded = await VendorSubscription.findByIdAndUpdate(filter,newSubData);
        return subDataAdded;
       }
       else{
        console.error("Couldn't find plan");
       }
      
    } catch (error) {
     console.log(error);
    }
  };




// Get Subscription Status Info
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const query = {
      //skip = size * (pageNo - 1),
      //limit = size,
    };
  
  const token = req.header("auth-token");
  const decodedToken = jwt.decode(token);

  const userId = decodedToken._id;

  const filter = { ownerId: userId };

  const foundSubscription = await VendorSubscription.findOne(filter, {}, query); //returns the first document that matches the query criteria or null
  
  
    if (!foundSubscription) return res.status(200).send({code:200, message: "Success",data : {'planStatus':"Inactive"} });

   
    const nextRechargeDate = foundSubscription.nextRechargeDate;
    var today = new Date();

    if(nextRechargeDate < today){
      console.log("Time to recharge");
      foundSubscription.planStatus= 'Inactive';
      foundSubscription.save();
    }
    else{
      console.log("We have time");
    }

    return res.status(200).send({code:200,message: "success", data: foundSubscription});

  } catch (error) {
    return res.status(400).send(error);
  }

};


exports.getCurrentSubscription = (userId) => {
    const query = {
      //skip = size * (pageNo - 1),
      //limit = size,
    };
  
    const filter = {ownerId: userId };
  
    VendorSubscription.findOne(filter, {}, query)
      .select("-__v -updatedAt")
      .exec((err, subData) => {
        if (err) console.log(err);
        return subData;
      });
  };



