const Order = require("../models/Order");
const Cart = require("../models/Cart");


const createOrder = async (req, res) => {
  try {

    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    const cart =
      await Cart.findOne({
        user: req.user._id,
      }).populate(
        "items.product"
      );

    if (
      !cart ||
      cart.items.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message: "Cart Is Empty",
      });

    }

    let totalAmount = 0;

    cart.items.forEach((item) => {

      totalAmount +=
        item.product.price *
        item.quantity;

    });

    const order =
      await Order.create({

        user: req.user._id,

        items: cart.items.map(
          (item) => ({
            product:
              item.product._id,

            quantity:
              item.quantity,
          })
        ),

        totalAmount,

        shippingAddress,

        paymentMethod,

        paymentStatus:
          paymentMethod === "COD"
            ? "Pending"
            : "Paid",

      });

    cart.items = [];

    await cart.save();

    res.status(201).json({
      success: true,
      message:
        "Order Created Successfully",
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user._id,
    })
      .populate(
        "items.product",
        "name price image"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const updateOrderStatus = async (req, res) => {
  try {

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };