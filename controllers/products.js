const { products, productImages, categories } = require("../models")
const { op, Op } = require("sequelize");
const fs = require("fs");
const { templateResponse } = require("../helper/utils")

module.exports = {
    getProducts: async (req, res, next) => {
        try {
            const { category } = req.query
            const result = await products.findAll({
                include: [
                    {
                        model: productImages,
                        attributes: [`img`]
                    },
                    {
                        model: categories,
                        attributes: [`name`],
                        where: { name: category || { [Op.ne]: null }, }
                    }
                ]
            })
            return res.status(200).send(result)
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error get products", error.message))
        }
    },
    addProducts: async (req, res, next) => {
        try {
            const checkName = await products.findOne({ where: { name: req.body.name } })
            if (checkName) {
                req.files.forEach(async (value) => {
                    fs.unlinkSync(`./${value.path}`)
                })
                throw new Error("Product name has already been used")
            }
            const result = await products.create({
                name: req.body.name,
                price: parseInt(req.body.price),
                stock: parseInt(req.body.stock),
                categoryId: req.body.categoryId || null
            })

            req.files.forEach(async (value) => {
                await productImages.create({
                    productId: result.id,
                    img: value.filename
                })
            })
            return res.status(200).send({
                success: true,
                message: "Successfully added products"
            })
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error adding product.", error.message))
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const checkProduct = await products.findOne({ where: { id: req.params.id }, include: [{ model: productImages, attributes: ["img"], raw: true }] })
            if (!checkProduct) { throw new Error("Can't find the selected product.") }
            if (req.files.length) {
                checkProduct.productImages.forEach((value) => {
                    fs.unlinkSync(`./public/productImages/${value.img}`)
                })
                await productImages.destroy({ where: { productId: req.params.id } })
            }

            const { name, price, stock, categoryId } = req.body
            await products.update({
                name,
                price,
                stock,
                categoryId
            }, { where: { id: req.params.id } })

            req.files.forEach(async (value) => {
                await productImages.create({
                    productId: req.params.id,
                    img: value.filename
                })
            })

            return res.status(200).send({
                success: true,
                message: "Successfully updated product."
            })

        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error updating product.", error.message))
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const result = await products.destroy({ where: { id: req.params.id } })
            if (!result) { throw { rc: 400, message: "Cannot find selected product." } }
            else {
                const result2 = await productImages.findAll({ where: { productId: req.params.id }, raw: true })
                result2.forEach((value) => {
                    fs.unlinkSync(`./public/productImages/${value.img}`)
                })
                await productImages.destroy({ where: { productId: req.params.id } })
                return res.status(200).send({ success: true, message: "Successfully deleted product." })
            }
        } catch (error) {
            console.log(error);
            next(templateResponse(error.rc || 500, "Error on delete product.", error.message))
        }
    }
}