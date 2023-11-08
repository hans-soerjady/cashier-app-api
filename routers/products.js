const router = require("express").Router();
const {productsController} = require("../controllers");
const {uploader} = require("../helper/uploader");

router.get("/", productsController.getProducts)
router.post("/", uploader("/productImages").array("fileuploads", 4), productsController.addProducts)
router.patch("/:id", uploader("/productImages").array("fileuploads", 4), productsController.updateProduct)
router.delete("/:id", productsController.deleteProduct)

module.exports = router
