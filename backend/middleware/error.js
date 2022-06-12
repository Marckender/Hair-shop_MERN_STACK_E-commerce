const ErrorHandler = require("../utils/ErrorHandler");


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server Errors";


    //wrong mongo id error
    if(err.name ==="CastError") {
        const message = `Ressources not found with this id ..invalid ${err.path}`;
        err = new ErrorHandler(message, 404);
    }


    // Duplicate key Error
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400)
    }

    // Wrong jwt key Error
    if(err.name ===  "jsonWebTokenError") {
        const message = `Your url is invalid please try again`;
        err = new ErrorHandler(message, 400)
    }

    // Wrong jwt Expired
    if(err.name ===  "TokenExpiredError") {
        const message = `Your url is expired please try again`;
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode
    });
}; 
