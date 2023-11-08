const router = require("express").Router();
const { categoriesController } = require("../controllers");
const { uploader } = require("../helper/uploader");

router.get("/", categoriesController.getCategories)
router.post("/", uploader("/categoryImg").single("fileupload"), categoriesController.addCategory)
router.patch("/:id", uploader("/categoryImg").single("fileupload"), categoriesController.updateCategory)
router.delete("/:id", categoriesController.deleteCategory)

module.exports = router;