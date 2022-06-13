const express = require("express");
const { createOrder } = require("../controller/OrderController");
const router = express.Router();
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");


// router.route("/product/new").post(isAuthenticateUser, authorizeRoles("admin"),  createProduct);

router.route("/product/new").post(isAuthenticateUser,  createOrder);



module.exports = router;
