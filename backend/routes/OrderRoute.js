const express = require("express");
const {
  createOrder,
  getSingleOrder,
  getAllOrders,
  getAdminOrders,
  updateAdminOrder,
  deleteOrder,
} = require("../controller/OrderController");
const router = express.Router();
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

// router.route("/product/new").post(isAuthenticateUser, authorizeRoles("admin"),  createProduct);

router.route("/order/new").post(isAuthenticateUser, createOrder);
router.route("/order/:id").get(isAuthenticateUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticateUser, getAllOrders);

router
  .route("/admin/orders")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAdminOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticateUser, authorizeRoles("admin"), updateAdminOrder);

router.route("/admin/order/:id").delete(isAuthenticateUser, deleteOrder);

module.exports = router;
