const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Please enter a product name"],
        trim: true,
        maxLength: [50, " Product name cannot exceed than 20 characters"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength:[4000, "Description can not exceed than 4000"]
    },
    price: {
        type: Number,
        required: [true, "Please add a price for yout product"],
        maxlength: [8, " Product Price cannot exceed than 8 characters"]
    },
    discountPrice: {
        type: String,
        maxlength: [4, " Product discount cannot exceed than 4 characters"]
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please enter a category"]
    },
    stock: {
        type: Number,
        required: [true, "Please add some stock"],
        maxLength: [3, " Stock cannot exceed than 3 characters"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
          user: {
              type: mongoose.Schema.ObjectId,
              ref: "User",
          },
          name: {
              type: String,
          },
          rating: {
              type: Number,
          },
          comment: {
              type: String
          },
          time: {
              type: Date,
              default: Date.now()
          }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Product", productSchema);