const { response } = require('express');
const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');

const uuid = require('uuid').v4;
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  process.env.UPLOAD_EMPLOYEE_FOLDER)
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    },
})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if(!file.originalname.endsWith('.xlsx')){
            return cb(new Error("Please upload an Excel file."));
        }
        cb(undefined, true)
    }
});

router.get('/', employeeController.employee_index);

router.get('/create', employeeController.employee_create);

router.get('/getTeachers', employeeController.getTeachers);

router.post('/create',upload.single('file'), async (req, res,next) => {
  
    next()
}, employeeController.employee_addTeacherFromExcel)

router.post('/createOne', employeeController.addOneEmployee)

router.get('/:id/edit', employeeController.employee_edit);

router.get('/getmanagerdata',employeeController.get_Manager_Data);

// router.put('/:id', employeeController.employee_update);

router.delete('/:id', employeeController.employee_delete);

module.exports = router;