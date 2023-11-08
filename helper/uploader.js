const multer = require("multer");
const fs = require("fs");
const { log } = require("console");

module.exports = {
    uploader: (directory) => {
        const defaultDirectory = "./public";
        const storageUploader = multer.diskStorage({
            destination: (req, file, cb) => {
                const pathDir = directory ? defaultDirectory + directory : defaultDirectory
                if (fs.existsSync(pathDir)) { cb(null, pathDir); }
                else {
                    fs.mkdir(pathDir, (error) => {
                        if (error) { console.log(`Error make directory`, error); }
                        return cb(error, pathDir)
                    })
                }
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`)
            }
        })
        const fileFilter = (req, file, cb) => {
            if ((file.originalname).toLowerCase().includes(".png") || (file.originalname).toLowerCase().includes(".jpg")) {
                cb(null, true)
            } else {
                cb(new Error("Your file is not in a supported format, please upload only PNG or JPG files.", false))
            }
        };
        return multer({ storage: storageUploader, fileFilter })
    }
}