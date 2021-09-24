const multer = require('multer');
const path = require('path');

const uploadAuth = (req, res, next) => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'public/uploads'),
        filename: (req, file, cb) => {
            uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E8)}${path.extname(file.originalname)}`,
                cb(null, uniqueName)
        }
    });

    const upload = multer({
        storage,
        limits: { fileSize: 1000000 * 5 }
    }).single('myFile');

    req.upload = upload;
    next();
}

module.exports = uploadAuth;