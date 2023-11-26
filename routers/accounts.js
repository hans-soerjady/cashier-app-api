const router = require("express").Router();
const { accountsController } = require("../controllers");
const { validateToken } = require("../middlewares/validation");

router.get("/", accountsController.getAccounts);
router.post("/register", accountsController.register);
router.post("/login", accountsController.login);
router.post("/keepLogin",validateToken, accountsController.keepLogin);
router.delete("/:id", accountsController.deleteAccount);

module.exports = router