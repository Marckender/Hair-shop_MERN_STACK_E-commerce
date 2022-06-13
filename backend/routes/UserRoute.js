const express = require("express");
const router = express.Router();
const { createUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    userDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser, 
    updateUserRole,
    deleteUser
} = require("../controller/UserController");
const { isAuthenticateUser, authorizeRoles } = require("../middleware/auth");


router.route("/register").post(createUser);
router.route("/me").get(isAuthenticateUser, userDetails);
router.route("/me/update").put(isAuthenticateUser, updatePassword);
router.route("/me/update/info").put(isAuthenticateUser, updateProfile);
router.route("/admin/users").get(isAuthenticateUser, authorizeRoles("admin"), getAllUsers);

router.route("/admin/user/:id")
        .get(isAuthenticateUser, authorizeRoles("admin"), getSingleUser)
        .put(isAuthenticateUser, authorizeRoles("admin"), updateUserRole)
        .delete(isAuthenticateUser, authorizeRoles("admin"), deleteUser);


router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);


router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);



module.exports = router;