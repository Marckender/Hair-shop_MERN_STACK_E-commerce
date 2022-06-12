const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");


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
    }

    
    // const token = user.getJwtToken();

    sendToken(user, 201, res)
});


exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token")
})