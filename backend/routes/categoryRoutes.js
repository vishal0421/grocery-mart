const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("image"), createCategory);

router.get("/", getCategories);

module.exports = router;