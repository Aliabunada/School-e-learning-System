const student_model = require('../model/student').Studentmode;
const xlsxFile = require('read-excel-file/node');
const Permissions = require('../model/permission').permissions_model;
const validUrl = require('valid-url');
const User = require('../model/user');
const Role = require('../model/role').role_model;
const Parent = require('../model/parent').parent_model;
const notUndefinedNotNull = require('../helper/classfun').notUndefinedNotNull
let {readExcelFile} = require('../helper/student')

const Class_model = require('../model/class').Class_model;
const fs = require('fs');

const handleError = (err) => {
    const errors = {};

    // Duplicate error code
    if (err.code === 11000) {
        errors.email = 'Role name already exist';
        return errors;
    }

    // Validations Errors
    if (err.message.includes('permissions_model validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const student_index = (req, res) => {
    res.send('students Index Page');
};

const student_create = (req, res) => {
    res.send('students Create Page');
};
const getStudentsInClass = (req, res) => {
    let level = req.params.id.slice(0, -1)
    let branch = req.params.id.slice(-1);

    return Class_model.findOne({ branch: branch, level: level })
        .then(async function (classDoc) {
            if (notUndefinedNotNull(classDoc)) {
                student_model.find({ classforignkey: classDoc._id })
                    .then(async studentDoc => {

                        if (notUndefinedNotNull(studentDoc)) {
                            res.status(200).send({ studentDoc });
                        }
                        else {
                            res.status(200).send('No Students In this Class')
                        }
                    }).catch(err => {
                        res.status(400).send({ err })
                    })
            }
            else {
                res.status(400).send('Faild Delete the Class  ')
            }

        })
};



const addOneStudent = (req, res) => {


    var passwordstd = req.body.password;
    let studentData = {
        identification_number: req.body.StudentId,
        full_name_ar: req.body.StudentName,
        full_name_en: req.body.studentName_en,
        phone_number: req.body.phone_number,
        birthday_date: req.body.dateOfBirth,
        gender: req.body.gender,
        address: req.body.address,
        nationality: req.body.nationality,
        religion: req.body.religion,
    }
    let parentdata = {
        identification_number: req.body.parentIdentification_number,
        full_name_ar: req.body.parentName,
        phone: req.body.phone_number,
        Job: req.body.Job,
    }
    let classdata = {
        level: req.body.level,
        grade: req.body.grade,
        branch: req.body.branch,
    }

    var student = {};
    return student_model.findOne({ identification_number: studentData.identification_number })
        .then(async function (std) {
            if (notUndefinedNotNull(std)) {
                res.status(400).send('the student is already existed');
            }
            else {
                return await Class_model.findOne({ level: classdata.level, branch: classdata.branch })
                    .then(async function (classlevel) {
                        await Parent.findOne({ identification_number: parentdata.identification_number })
                            .then(async function (parent) {
                                if (notUndefinedNotNull(parent)) {
                                    student.parent_id = parent._id
                                }
                                else {
                                    var newparent = new Parent(parentdata)
                                    newparent.save()
                                        .then(async function (parent) {
                                            student.parent_id = parent._id
                                        })
                                }
                            })
                        if (notUndefinedNotNull(classlevel)) {
                            student.classforignkey = classlevel._id
                            await Object.assign(student, studentData)
                            var newstd = new student_model(student)
                            newstd.save()
                                .then((std) => {
                                    const permission = new Permissions({ edit_employees: false, edit_students: false, edit_parents: false, add_subjects: false, edit_classRoom: false, manage_classRoom: false })
                                    return permission.save()
                                        .then(async function (permissionDoc) {
                                            const role = new Role({ name: "Student", permissions_id: permissionDoc._id })
                                            return await role.save()
                                                .then(async function (roleDoc) {
                                                    const user = new User({ password: req.body.password, userID: req.body.StudentId, username: req.body.StudentName, role_Id: roleDoc._id })
                                                    return await user.save()
                                                        .then(async function (user) {
                                                            console.log('success ^_^')
                                                            res.status(200).json({ StudentId: std._id, UserId: user._id })
                                                        })

                                                })
                                        })
                                })
                                .catch((err) => {
                                    console.log(err, 'faild ^_^')
                                    console.log(err, 'err')
                                    res.status(404).send('fiald')
                                })

                        }
                        else {
                            res.status(400).send('Class not found \n Please Add the Class befor add The Student');
                        }

                    })

            }

        }).catch((err) => { res.status(400).send(err) })

}

const studentAddFromExcel = async (req, res) => {
 console.log(req.body.password)
  try {
    let result = await readExcelFile(req.body.password,req);
      res.status(200).send(result)
  } catch (error) {
      console.log(error)
      res.status(400).send(error)
  }
  
    
}

const student_edit = (req, res) => {
    res.send(req.params.id)
};

const student_update = async (req, res) => {
    res.send("student Update")
};

const student_delete = async (req, res) => {
    const studentID = req.params.id;
    console.log(studentID, 'studentID')

    try {
        await student_model.findOneAndRemove({ identification_number: studentID })
            .then(async doc => {
                await User.findOneAndRemove({ userID: studentID })
                    .then(async result => {
                        res.status(200).send('Deleted Successfully');

                    })
                // res.status(201).json({ redirect: '/url' });
            });
    } catch (err) {
        res.status(400).send('Faild Delete Student');
    }
};


module.exports = {
    student_index, student_create, studentAddFromExcel, student_edit, student_update, student_delete, addOneStudent, getStudentsInClass
};