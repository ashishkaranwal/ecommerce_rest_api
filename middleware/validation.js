const joi = require("joi");

function registerValidation(data) {
  const schema = joi.object({
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(4).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(4).required(),
    phone: joi.string().min(10).max(10)
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
    lastName: joi.string().min(4).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(4).required(),
    phone: joi.string().min(10).max(10),
    businessName: joi.string().min(2).max(50),
    businessAddress: joi.string().min(2).max(50),
    businessCity: joi.string().min(2).max(20),
    businessState: joi.string().min(2).max(20),
    businessPincode: joi.number().min(6)
  });
  return schema.validate(data);
}

module.exports = { registerValidation, loginValidation,registerVendorValidation };
