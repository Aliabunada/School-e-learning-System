const express = require('express');
const router = express.Router();
const classRoomTutorialController = require('../controller/classRoomTutorialController');
const classRoom_tutorial = require('../model/class_room_tutorial').classRoom_tutorial_model;
const uuid = require('uuid').v4;
const multer  = require('multer');
const path = require('path');

// SET STORAGE
const storage = multer.diskStorage({
    // dest: '/public/uploads/tutorials',
    destination: function (req, file, cb) {
        cb(null, './public/uploads/tutorial')
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        cb(null, 'Video' + '-' + Date.now() + '-' + originalname)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);

        if(ext !== '.mp4' && ext !== '.wmv' && ext !== '.mov' && ext !== '.jpeg') {
            return cb(new Error("Please upload a Video file."));
        }
        cb(undefined, true)
    },
    limits: {
        fileSize: 10485760 * 10, //10 MB * 5 = 50 MB
    },
}).single('file')

router.get('/', classRoomTutorialController.index);

router.get('/create/:roomCode', classRoomTutorialController.create);

router.post('/uploadVideoLink', classRoomTutorialController.uploadVideoLink);

router.post('/uploadVideo', upload, async (req, res) => {


    console.log('You upload a video');
    const {lesson_number, title, teacherID, subjectID, classRoomID} = req.body
    const file = req.file.filename

    try {
        let newLesson = await classRoom_tutorial.create({ lesson_number, title: title, material: { video: file }, teacherId: teacherID, SubjectId: subjectID, classRoom: classRoomID});
        res.status(201).json({ newLesson: newLesson._id });
    } catch (err) {
        res.status(400).send({ err: err.message })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/:id/edit', classRoomTutorialController.edit);

router.put('/:id', classRoomTutorialController.update);

router.delete('/:id', classRoomTutorialController.destroy);

module.exports = router;