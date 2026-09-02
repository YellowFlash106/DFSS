const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/chunks');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

        cb(null, uniqueName);
    },
})

const upload = multer({ 
    storage,
    limits:{
        fileSize: 100 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
        const allowed = ["image/png", "image/jpeg", "application/pdf"];

        if(!allowed.includes(file.mimetype)){
            return cb(new Error("Invalid file type."));
        }
        cb(null, true);
    }
});

module.exports = upload;