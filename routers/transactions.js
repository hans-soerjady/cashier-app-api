const router = require("express").Router();
const { transactionsController } = require("../controllers")
const { validateToken } = require("../middlewares/validation")

router.get("/", validateToken, transactionsController.getTransactions)
router.post("/", validateToken, transactionsController.addTransaction)

module.exports = router