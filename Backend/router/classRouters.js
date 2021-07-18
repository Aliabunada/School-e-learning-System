const express = require('express');
const router = express.Router();
const classesController = require('../controller/classesController');


router.get('/', classesController.getAllClasses);

router.get('/getClassesName', classesController.getClassesName);

router.post('/create', classesController.createClass)

router.get('/:id', classesController.getOneClass);

// router.put('/:id', classesController.student_update);

router.delete('/:id', classesController.class_delete);

module.exports = router;