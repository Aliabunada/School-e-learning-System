const express = require('express');
const router = express.Router();
const SubMaterialController = require('../controller/subMaterialController');
const sub_material = require('../model/sub_material').sub_material_model;
const uuid = require('uuid').v4;
const multer  = require('multer');
const path = require('path');

// SET STORAGE
const storage = multer.diskStorage({
    // dest: '/public/uploads/tutorials',
    destination: function (req, file, cb) {
        cb(null, './online-school-system/public/uploads/sub_material')
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        cb(null, 'Material' + '-' + Date.now() + '-' + originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10485760 * 10, //10 MB * 5 = 50 MB
    },
}).single('file')

router.get('/', SubMaterialController.index);

router.get('/create/:roomCode', SubMaterialController.create);

router.post('/uploadFileLink', SubMaterialController.uploadFileLink);

router.post('/uploadFile', upload, async (req, res) => {

    console.log('You upload a File');
    const {title, description, teacherID, subjectID, classRoomID} = req.body
    const file = req.file.filename

    try {
        const newMaterial = await sub_material.create({ title: title, description, material: { file: file }, teacherID, SubjectId: subjectID, classRoom: classRoomID});
        res.status(201).json({ newMaterial: newMaterial._id });
    } catch (err) {
        res.status(400).send({ err: err.message })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/:id/edit', SubMaterialController.edit);

router.put('/:id', SubMaterialController.update);

router.delete('/:id', SubMaterialController.destroy);

module.exports = router;