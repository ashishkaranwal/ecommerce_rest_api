const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyUser,verifyVendor } = require("../middleware/verifyToken");

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

///User routes
router.post("/register-user", userController.signUp);

router.post("/login", userController.logIn);

router.patch('/profile_update',verifyUser, userController.updateUser);

router.patch('/changepassword',verifyUser, userController.updateUserPassword);

router.get("/profile_info", verifyUser, userController.profile);


module.exports = router;
