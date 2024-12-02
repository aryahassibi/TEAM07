const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/products", productController.listProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.get("/product/:variant_id", productController.getProductByVariantId);

module.exports = router;
