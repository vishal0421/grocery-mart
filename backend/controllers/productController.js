const Product = require("../models/Product");


const createProduct = async (req,res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const {
      name,
      description,
      price,
      stock,
      category,
      featured,
    } = req.body;

    const image =
      req.file.filename;

    const existingProduct =
      await Product.findOne({
        name
      });

    if (existingProduct) {

      return res.status(400).json({
        success:false,
        message:
        "Product already exists"
      });

    }

    const product =
      await Product.create({

        name,
        description,
        price,
        image,
        stock,
        category,
        featured: featured === 'true' || featured === true,

      });

    res.status(201).json({
      success:true,
      message:
      "Product Created Successfully",
      product,
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};
const getProducts = async (req, res) => {
  try {

    const {
      search,
      category,
      minPrice,
      maxPrice,
      featured,
    } = req.query;

    let filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    if (featured) {
      filter.featured = featured === 'true' || featured === true;
    }

    if (minPrice || maxPrice) {

      filter.price = {};

      if (minPrice) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice) {
        filter.price.$lte = maxPrice;
      }

    }

    const products =
      await Product.find(filter);

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getSingleProduct =async (req, res) => {

  try {

    const product =
    await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });

    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
const updateProduct = async (req, res) => {
  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });

    }

    const updatedProduct =
      await Product.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      );

    res.status(200).json({
      success: true,
      message:
        "Product Updated Successfully",
      product: updatedProduct,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const deleteProduct = async (req, res) => {
  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Product Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {createProduct,getProducts,getSingleProduct,updateProduct,deleteProduct};