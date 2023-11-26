const jwt = require("jsonwebtoken");
const { templateResponse } = require("../helper/utils");

module.exports = {
    validateToken: async (req,res,next) => {
        try {
            if(!req.token) {
                throw {rc: 400, message: "Token does not exist." }
            } else {
                const verifyData = jwt.verify(req.token, process.env.SCRT_TOKEN)
                if (!verifyData) {
                    throw {rc: 400, message: verifyData}
                }
                req.accountData= verifyData
                next()
            }
        } catch (error) {
            console.log(error);
            return res.status(error.rc || 500).send({success: false, message: error.message})
        }
    }
}