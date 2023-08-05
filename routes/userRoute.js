const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");

router.post("/", userController.signUp);

router.post("/login", userController.logIn);

router.patch('/:userId',verifyUser, userController.updateUser);

router.patch('/changepassword/:userId',verifyUser, userController.updateUserPassword);

router.delete('/:userId', userController.deleteUser);

router.get("/:email", verifyUser, userController.profile);

module.exports = router;
