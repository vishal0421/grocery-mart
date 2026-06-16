    const express = require("express");

    const {createProduct,getProducts,getSingleProduct,updateProduct,deleteProduct} = require("../controllers/productController");

    const upload =require("../middleware/uploadMiddleware");

    const router = express.Router();

    router.post("/",upload.single("image"),createProduct);

    router.get("/", getProducts);
    router.get("/:id", getSingleProduct);
    router.put("/:id",updateProduct);
    router.delete("/:id",deleteProduct);

    module.exports = router;