const { transactions, transactionDetails } = require("../models")
const { templateResponse } = require("../helper/utils")
const { Op } = require("sequelize")

module.exports = {
    getTransactions: async (req, res, next) => {
        try {
            const { id, custEmail, cashierId } = req.query
            const result = await transactions.findAll({
                where: {
                    id: id || { [Op.ne]: null },
                    custEmail: custEmail || { [Op.ne]: null },
                    cashierId: cashierId || { [Op.ne]: null }
                },
                include: [
                    {
                        model: transactionDetails
                    },
                ],
                require: true
            })
            return res.status(200).send(result)
        } catch (error) {
            console.log(error);
            next(templateResponse(error.rc || 500, "Error get transactions.", error.message))
        }
    },
    addTransaction: async (req, res, next) => {
        try {
            const { custEmail, totalAmount, transactionDetails } = req.body
            console.log(transactionDetails);
            console.log(req.accountData);
        } catch (error) {
            console.log(error);
            next(templateResponse(error.rc || 500, "Error add transaction", error.message))
        }
    }
}