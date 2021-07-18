const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const uuid = require('uuid').v4;
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  process.env.UPLOAD_STUDENT_FOLDER)
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    },
})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(req.body)
        if(!file.originalname.endsWith('.xlsx')){
            return cb(new Error("Please upload an Excel file."));
        }
        cb(undefined, req);
    }
});

router.get('/', studentController.student_index);

router.get('/getStudentsInClass/:id', studentController.getStudentsInClass);

router.post('/create', upload.single('file'), async (req, res,next) => {
    next();
},studentController.studentAddFromExcel)

router.post('/createOne', studentController.addOneStudent)

router.get('/:id/edit', studentController.student_edit);

router.put('/:id', studentController.student_update);

router.delete('/:id', studentController.student_delete);

module.exports = router;