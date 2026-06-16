const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Add To Wishlist
const addToWishlist = async (req, res) => {
  try {

    const { productId } = req.body;

    // Product exist karta hai?
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // User ki wishlist dhundo
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    // Agar wishlist nahi hai
    if (!wishlist) {

      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });

      return res.status(201).json({
        success: true,
        message: "Added To Wishlist",
        wishlist,
      });
    }

    // Product pehle se wishlist me hai?
    const exists = wishlist.products.includes(productId);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product Already In Wishlist",
      });
    }

    // Product add karo
    wishlist.products.push(productId);

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Added To Wishlist",
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getWishlist = async (req, res) => {
  try {

    const wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      }).populate(
        "products",
        "name price image stock category"
      );

    if (!wishlist) {

      return res.status(200).json({
        success: true,
        wishlist: {
          products: [],
        },
      });

    }

    res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const removeFromWishlist =async (req, res) => {

  try {

    const { productId } =
      req.params;

    const wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {

      return res.status(404).json({
        success: false,
        message:
        "Wishlist Not Found",
      });

    }

    wishlist.products =
      wishlist.products.filter(
        (item) =>
          item.toString() !==
          productId
      );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message:
      "Product Removed From Wishlist",
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};