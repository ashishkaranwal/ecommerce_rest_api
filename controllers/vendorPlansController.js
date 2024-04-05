const VendorPlan = require("../models/vendorPlanModel");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}



exports.createPlan = async (req, res, next) => {
  try {
    const newPlan = {
      planName: req.body.name,
      planValidity: req.body.validity,
      planPrice: req.body.price
    };
    
    const plan = await VendorPlan.create(newPlan);
    return res.status(200).send({ message: "Plan created successfully!", plan });
  } catch (error) {
    if (error.code === 11000) return res.status(200).send({ message: "plan already exist" });
    return res.status(400).send({ message: "unable to create plan", error });
  }
};

exports.updatePlan = async (req, res, next) => {
  const filter = { _id: req.body.id };
  await Plan.findByIdAndUpdate(filter, update);
}


exports.getPlans = (req, res, next) => {
  const query = {
    //skip = size * (pageNo - 1),
    //limit = size,
  };

  VendorPlan.find({}, {}, query)
    .select("-__v -updatedAt")
    .exec((err, plans) => {
      if (err) return res.status(400).send({code:400, message: "showing order", err });
      return res.status(200).send({code:200, message: "showing all plans", data: plans });
    });
};

exports.getPlan = async (id) => {
  try {
    const foundPlan = await VendorPlan.findById(id); //returns the first document that matches the query criteria or null
    return foundPlan;
  } catch (error) {
  }
};

