const express = require("express");
const router = express.Router();
const { getAllProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getSingleProduct,
        createProductReview,
        getSingleProductReviews,
        deleteReview
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

    router.route("/product/review").post(isAuthenticateUser, createProductReview);
    router.route("/reviews")
        .get(getSingleProductReviews)
        .delete(isAuthenticateUser, authorizeRoles("admin"), deleteReview)


module.exports = router;