const express = require("express");
const router = express.Router();
const { getAllProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getSingleProduct
    } = require("../controller/ProductController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");

    //Product CRUD
router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticateUser, authorizeRoles("admin"),  createProduct);

router
    .route("/product/:id")
    .put(isAuthenticateUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticateUser, authorizeRoles("admin"),deleteProduct)
    .get(getSingleProduct);

module.exports = router;