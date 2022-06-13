const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");


// Create User
exports.createUser = catchAsyncErrors(async (req, res, next)=> {
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar :{
            public_id: "https://robohash.org/honey?set=set1",
            url: "https://robohash.org/honey?set=set1"
        }
    });

    sendToken(user, 201, res)
});


//Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400));
    };

    const user = await User.findOne({email}).select("+password");
    if(!user) {
        return next(new ErrorHandler("user not found"), 401);
    };

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("password not match"), 401)
    };
    
    // const token = user.getJwtToken();
    sendToken(user, 201, res);
});


// Logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message:"Logout with success"
    });
});


//forgot Password
exports.forgotPassword = catchAsyncErrors( async (req, res, next)=> {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler("User email not found", 404));
    };
    // Resetpassword token
    const resetToken = user.getResetToken();

    await user.save({
        validateBeforeSave: false
    });

    const resetPasswordUrl = `${req.protocol}: //${req.get("host")}/password/reset/${resetToken}`;
    const message = `Your password reset token is:- \n\n ${resetPasswordUrl} `;

    try {
        await sendMail({
            email: user.email,
            subject: `Mima Shop Password recover`,
            message
        });

        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;

        await user.save({
            validateBeforeSave: false
        });

        return next(new ErrorHandler(error.message));
    };
});


// Reset Password
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    //create Token Hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTime: {$gt: Date.now()}
    });

    if(!user) {
        return next(new ErrorHandler("This Url is invalid or has been expired", 400));
    };

    if(req.body.password !==req.body.confirmPassword) {
        return next(new ErrorHandler("Password is not matched with the new password", 400));
    };

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();

    sendToken(user, 200, res)
})


// users Details
exports.userDetails = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});


//update User Password
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect"), 401);
    };

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password not matched with each other"), 400);
    };

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user, 200, res);
});


// Update User profile]
exports.updateProfile = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "user updade successfully",
        user
    })

});


// Get All Users
exports.getAllUsers = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});



// Get Single User
exports.getSingleUser = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);
    console.log(user);

    if(!user) {
        return next(new ErrorHandler("User not found", 400));
    };

    res.status(200).json({
        success: true,
        user
    });
});


// Update Role
exports.updateUserRole = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "user updade successfully",
        user
    });
});

// Delete Role ---Admin
exports.deleteUser = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler("User not found", 400));
    };
    await user.remove()

    res.status(200).json({
        success: true,
        message: "user deleted successfully",
    });
});