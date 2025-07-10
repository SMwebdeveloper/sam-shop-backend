const express = require("express")
const productController = require("../controllers/product.controller")

const router = express.Router()

router.get('/', productController.getAllProducts)
router.get("/:id", productController.getById)
router.post("/add", productController.create)
router.put("/update/:id", productController.update)
router.delete("/delete/:id", productController.delete)
router.post("/:id/ratings", productController.addProductRating)

module.exports = router