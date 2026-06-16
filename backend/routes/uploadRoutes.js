const express = require("express");

const upload =
require("../middleware/uploadMiddleware");

const router =
express.Router();

router.post(
  "/",
  upload.single("image"),
  (req, res) => {

    res.status(200).json({
      success: true ,
      filename: req.file.filename,
    });

  }
);

module.exports = router;