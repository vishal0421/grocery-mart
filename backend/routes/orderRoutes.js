const express = require("express");

const { protect, adminOnly } =
require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/all", protect, adminOnly, getAllOrders);

router.put("/:orderId", protect, adminOnly, updateOrderStatus);

module.exports = router;