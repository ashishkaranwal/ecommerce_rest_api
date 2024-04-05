const joi = require("joi");

function registerValidation(data) {
  const schema = joi.object({
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(4).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(4).required(),
    phone: joi.string().min(10).max(10),
    roles: joi.array().contains("USER")
  });
  return schema.validate(data);
}

function loginValidation(data) {
  const schema = joi.object({
    email: joi.string().min(6).email().required(),
    password: joi.string().min(4).required(),
  });
  return schema.validate(data);
}

function registerVendorValidation(data) {
  const schema = joi.object({
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    phone: joi.string().min(10).max(10),
    referralCode: joi.string().min(8).max(8)
  });

  return schema.validate(data);
}


function registerCmValidation(data) {
  const schema = joi.object({
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    phone: joi.string().min(10).max(10),
    referralCode: joi.string().min(8).max(8)
  });

  return schema.validate(data);
}

function addBusinessValidation(data) {
  const schema = joi.object({
    phone: joi.string().min(10).max(10).required(),
    businessName: joi.string().required(),
    businessAddress: joi.string().required(),
    businessCity: joi.string().required(),
    businessState: joi.string().required(),
    businessPincode: joi.boolean().required(),
    businessCordinates: joi.string().required()
  });

  return schema.validate(data);
}


function rewardValidation(data) {
  const schema = joi.object({
    amount: joi.number().required(),
    applicableOn: joi.string().required(),
    type: joi.string().required(),
    levelName: joi.string().required()
  });

  return schema.validate(data);
}


module.exports = {registerValidation, loginValidation, registerVendorValidation,addBusinessValidation,rewardValidation,registerCmValidation};
