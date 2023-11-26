const { templateResponse } = require("../helper/utils")
const { accounts } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = {
    getAccounts: async (req, res, next) => {
        try {
            const result = await accounts.findAll()
            return res.status(200).send(result)
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error getAccounts", error.message))
        }
    },
    register: async (req, res, next) => {
        try {
            const checkEmail = await accounts.findOne({ where: { username: req.body.username } })
            if (checkEmail) {
                return next(templateResponse(400, "Username has already been registered", null))
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            req.body.password = hashPassword

            const result = await accounts.create({
                username: req.body.username,
                password: req.body.password,
                role: req.body.role
            })

            return res.status(200).send({
                success: true,
                message: "register successful",
                result
            })
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error register account", error.message))
        }
    },
    login: async (req, res, next) => {
        try {
            const result = await accounts.findOne({
                where: {
                    username: req.body.username
                },
                raw: true,
            })
            if (!result?.username) { throw new Error("Cannot find account with the same username") }
            const isValid = await bcrypt.compare(req.body.password, result.password)
            if (isValid) {
                delete result.password
                const { id, username, role } = result;
                // GENERATE TOKEN
                const token = jwt.sign(
                    { id, username, role }, process.env.SCRT_TOKEN, { expiresIn: "4h" }
                )
                return res.status(200).send({
                    success: true,
                    message: "Login successful",
                    result: {
                        username,
                        token
                    }
                })
            } else {
                throw new Error("Incorrect password")
            }
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error login account", error.message))
        }
    },
    deleteAccount: async (req, res, next) => {
        try {
            const result = await accounts.destroy({ where: { id: req.params.id } })
            if (!result) { throw new Error("Cannot find the selected account.") }
            else {
                return res.status(200).send({
                    success: true,
                    message: "Successfully deleted account."
                })
            }
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error delete account.", error.message))
        }
    },
    keepLogin: async (req, res, next) => {
        try {
            const result = await accounts.findOne({ where: { id: req.accountData.id } })
            const { id, username, role } = result;
            const token = jwt.sign({ id, username, role }, process.env.SCRT_TOKEN)
            return res.status(200).send({
                success: true,
                result: {
                    username,
                    token
                }
            })
        } catch (error) {
            console.log(error);
            next(templateResponse(error.rc || 500, "Error keep login account", error.message))
        }
    }
}