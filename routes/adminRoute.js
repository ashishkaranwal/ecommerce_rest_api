const router = require("express").Router();
const adminController = require("../controllers/adminController");
const vendorPlanController = require("../controllers/vendorPlansController");
const userController = require("../controllers/userController");
const {verifyAdmin } = require("../middleware/verifyToken");

router.post("/", adminController.signUp)

router.post("/login", adminController.logIn)

router.patch('/:userId', adminController.updateAdmin);

router.delete('/:userId', adminController.deleteAdmin); //delete admin

router.delete('/user/:userId', userController.deleteUser); //delete user

router.get("/data", verifyAdmin, adminController.data);

router.post("/add-vendor-plan",verifyAdmin, vendorPlanController.createPlan);

router.get("/get-plans",verifyAdmin, vendorPlanController.getPlans);

module.exports = router;
