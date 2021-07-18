const express = require('express');
const router = express.Router();
const subjectController = require('../controller/subjectController');
const Subject = require('../model/subject');
const uuid = require('uuid').v4;
const multer  = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/subjects')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    },
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if(!file.originalname.endsWith('.pdf')){
            return cb(new Error("Please upload a PDF file."));
        }
        cb(undefined, true)
    }
});

router.get('/', subjectController.subject_index);

router.get('/getSubjectListName', subjectController.subjectsListName);

router.get('/create', subjectController.subject_create);

router.post('/uploadLinkFile', subjectController.subject_UploadMaterial)

router.post('/uploadPDFFile', upload.single('file'), async (req, res) => {
    const {subjectName, level} = req.body
    const file = req.file.filename
    
    try {
        const newSubject = await Subject.create({ subjectName: subjectName, subject: file, level: level });
        res.status(201).json({ newSubject: newSubject._id });
    } catch (err) {
        res.status(400).send({ error: error.message })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/:id/edit', subjectController.subject_edit);

router.put('/:id', subjectController.subject_update);

router.delete('/:id', subjectController.subject_delete);

module.exports = router;