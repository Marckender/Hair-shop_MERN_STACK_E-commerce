const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

const jwt = require( "jsonwebtoken");
const User = require("../models/UserModel");



exports.isAuthenticateUser = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        new next(new ErrorHandler("Please login for access this ressources"));
    };

    const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decodeData.id);
    
    next();
});

// App Role
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} cannot access this resources`))
        };
        next();
    };
};