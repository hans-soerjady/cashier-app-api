const { templateResponse } = require("../helper/utils");
const { categories } = require("../models")
const fs = require("fs")

module.exports = {
    getCategories: async (req, res, next) => {
        try {
            const result = await categories.findAll()
            return res.status(200).send(result)
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error get categories.", error.message))
        }
    },
    addCategory: async (req, res, next) => {
        try {
            const checkCategory = await categories.findOne({ where: { name: req.body.name } })
            if (checkCategory) {
                // KALO ADA CATEGORY DENGAN NAMA YANG SAMA
                // HAPUS FILE IMAGE
                fs.unlinkSync(`./${req.file.path}`)
                throw new Error("Category already exists.")
            }
            const result = await categories.create({
                name: req.body.name,
                image: req.file.filename
            })

            return res.status(200).send({
                success: true,
                message: `Successfully added ${req.body.name} as a category.`
            })
        } catch (error) {
            console.log(error);
            fs.unlinkSync(`./${req.file.path}`)
            next(templateResponse(500, "Error adding category", error.message))
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const checkCategory = await categories.findOne({ where: { id: req.params.id }, raw: true })
            if (!checkCategory) { throw new Error("Can't find the selected category.") }
            if (req.file) { fs.unlinkSync(`./public/categoryImg/${checkCategory.image}`) }

            const { name } = req.body
            await categories.update({
                name,
                image: req.file ? req.file.filename : checkCategory.image
            }, { where: { id: req.params.id } })

            return res.status(200).send({
                success: true,
                message: "Successfully updated category.",
            })
        } catch (error) {
            console.log(error);
            next(templateResponse(500, "Error updating category.", error.message))
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            const result = await categories.destroy({ where: { id: req.params.id } })
            if (!result) { throw { rc: 400, message: "Error getting selected category." } }
            else {
                return res.status(200).send({
                    success: true,
                    message: "Successfully deleted category."
                })
            }
        } catch (error) {
            console.log(error);
            next(templateResponse(error.rc || 500, "Error updating category.", error.message))
        }
    }
}