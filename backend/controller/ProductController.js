const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Features = require("../utils/Features");

//create product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    });
});


//GetAll Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    const feature = new Features(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
        
    const products = await feature.query;
    res.status(200).json({
        success: true,
        resultPerPage,
        products
    });
});


//update Products --Admin
exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 500))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useUnified: false
    });
    res.status(200).json({
        success: true,
        message: "Pruduct updated successfully",
        product
    });
});

//Delete Product by Id
exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 500))
    };
    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product successfully Deleted"
    });
});


//Single Product details
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    };

    res.status(200).json({
        success: true,
        product,
        productCount
    });
});
