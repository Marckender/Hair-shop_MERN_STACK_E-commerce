const ErrorHandler = require("../utils/ErrorHandler");


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server Errors";


    //wrong mongo id error
    if(err.name ==="CastError") {
        const message = `Ressources not found with this id ..invalid ${err.path}`;
        err = new ErrorHandler(message, 404);
    }



    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode
    });
}; 
