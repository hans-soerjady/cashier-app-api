const router = require("express").Router();
const { accountsController } = require("../controllers")

router.get("/", accountsController.getAccounts);
router.post("/register", accountsController.register);
router.post("/login", accountsController.login);
router.delete("/:id", accountsController.deleteAccount);

module.exports = router