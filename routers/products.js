const router = require("express").Router();
const {productsController} = require("../controllers");
const {uploader} = require("../helper/uploader");
const { validateToken } = require("../middlewares/validation");

router.get("/", productsController.getProducts)
router.post("/", validateToken, uploader("/productImages").array("fileuploads", 4), productsController.addProducts)
router.patch("/:id", validateToken, uploader("/productImages").array("fileuploads", 4), productsController.updateProduct)
router.delete("/:id", validateToken, productsController.deleteProduct)

module.exports = router
