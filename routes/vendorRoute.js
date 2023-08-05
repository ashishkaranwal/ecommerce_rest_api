const router = require("express").Router();
const vendorController = require("../controllers/vendorController");
const paymentController = require("../controllers/paymentController");
const vendorPlanController = require("../controllers/vendorPlansController");
const { verifyVendor } = require("../middleware/verifyToken");

const multer = require("multer");
const path = require("path");



//Setting storage engine
const vendorProfilePicStorageEngine = multer({
  storage: multer.memoryStorage(),
});

//Initializing upload
const vendorProfilePicUpload = multer({
  storage: vendorProfilePicStorageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = function (file, cb) {
  //Allowed ext
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check ext
  const extName = fileTypes.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Upload Images Only!!");
  }
};




router.post("/register", vendorController.signUp);

router.post("/login", vendorController.logIn);

router.patch('/profile_update',verifyVendor, vendorController.updateVendor);

router.patch('/changepassword/:vendorId',verifyVendor, vendorController.updateVendorPassword);

router.get("/get-vendor-plans",verifyVendor, vendorPlanController.getPlans);

router.delete('/:vendorId', vendorController.deleteVendor);

router.get("/:email", verifyVendor, vendorController.profile);

router.post("/upload_profile_pic", vendorProfilePicStorageEngine.single("image"), vendorController.updateVendorProfilePic);


router.get("/get-plan-status", verifyVendor, vendorController.getPlanActiveDetails);

router.post("/pay",verifyVendor, paymentController.createTrxnToken);

router.post("/payment-status",verifyVendor, paymentController.getPaymentStaus);




module.exports = router;
