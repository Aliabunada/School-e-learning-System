const employee_model = require('../model/employee').employee_model;
const xlsxFile = require('read-excel-file/node');
const Permissions = require('../model/permission').permissions_model;
const validUrl = require('valid-url');
const User_model = require('../model/user');
const role_model = require('../model/role').role_model
const notUndefinedNotNull = require('../helper/classfun').notUndefinedNotNull;
const {readExcelFile} = require('../helper/employee');

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

const employee_index = (req, res) => {
    res.send('employees Index Page');
};

const employee_create = (req, res) => {
    res.send('employees Create Page');
};

const get_Manager_Data = (req, res) => {

    return role_model.findOne({ name: 'Admin' })
        .then(async function (role) {
            await User_model.findOne({ role_Id: role._id })
                .then(async function (user) {
                    await employee_model.findOne({ identification_number: user.userID })
                        .then((empDoc) => {
                            res.status(201).json({
                                managername: empDoc.full_name_ar,
                                manageremail: empDoc.email,
                                managerID: empDoc.identification_number,
                                jobNumber: empDoc.job_Number,
                                gender: empDoc.gender,
                                address: empDoc.address,
                                date_Of_birth: empDoc.date_Of_birth,
                                phone: empDoc.phone
                            })
                        })
                }).catch(() => { res.status(404).send('There is no manager') })
        }).catch(() => { res.status(404).send('There is no manager') })


}

const addOneEmployee = (req, res) => {
    var passwordTeacher = req.body.password;
    teacherData = {
        identification_number: req.body.identification_number,
        full_name_ar: req.body.full_name_ar,
        job_Number: req.body.job_Number,
        full_name_en: req.body.full_name_en,
        gender: req.body.gender,
        date_Of_birth: req.body.date_Of_birth,
        social_Status: req.body.social_Status,
        address: req.body.address,
        phone: req.body.phone,
        teaching_Subject: req.body.teaching_Subject,
    }
    return employee_model.findOne({ identification_number: teacherData.identification_number })
        .then(async function (teacher) {
            if (notUndefinedNotNull(teacher)) {
                res.status(400).send(`${teacher.full_name_en} is already existed`)
            }
            else {
                const permission = new Permissions({ edit_employees: false, edit_students: true, edit_parents: false, add_subjects: true, edit_classRoom: true, manage_classRoom: false })
                return permission.save()
                    .then(async function (permissionDoc) {
                        const role = new role_model({ name: "Teacher", permissions_id: permissionDoc._id })
                        return await role.save()
                            .then(async function (roleDoc) {
                                const user = new User_model({ password: passwordTeacher, userID: teacherData.identification_number, username: teacherData.full_name_ar, role_Id: roleDoc._id })
                                return await user.save()
                                    .then(async function (userDoc) {
                                        var newTeacher = new employee_model(teacherData)
                                        newTeacher.save()
                                            .then((newTeacherDoc) => {
                                                console.log('success ^_^')
                                                res.status(200).json({ TeacherId: newTeacherDoc._id, UserId: userDoc._id })
                                            })

                                    })
                            })
                    }).catch((err) => {
                        User_model.findOneAndRemove({ userID: teacherData.identification_number });
                        employee_model.findOneAndRemove({ identification_number: teacherData.identification_number, })
                        console.log(err, 'faild ^_^')
                        res.status(404).send('faild')
                    })
            }

        }).catch((err) => {
            console.log(err, 'faild ^_^')
            res.status(404).send('fiald')
        })

}


const employee_addTeacherFromExcel = async (req, res) => {
    console.log(req.body.password)
    try {
      let result = await  readExcelFile(req.body.password,req)
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
 
}
const employee_edit = (req, res) => {
    res.send(req.params.id)
};

const employee_update = async (req, res) => {
    res.send("Employee Update")
};

const employee_delete = async (req, res) => {
    const employeeID = req.params.id;

    try {
        await employee_model.findByIdAndDelete({ _id: employeeID })
            .then(async result => {
                await User_model.findOneAndDelete({ userID: employeeID })
                    .then(() => {
                        res.send('Deleted Successfully');
                    })

            });
    } catch (err) {
        res.status(400).json({ err });
    }
};

const getTeachers = (req, res) => {
    let teachers = []
    let teachersUsers = [];

    return role_model.find({ name: 'Teacher' })
        .then(async function (roleDoc) {
            if (notUndefinedNotNull(roleDoc) && roleDoc.length > 0) {
                Promise.all(
                    roleDoc.map(async role => {
                        await User_model.find({ role_Id: role._id })
                            .then(async usersDoc => {
                                if (notUndefinedNotNull(usersDoc)) {
                                    teachersUsers.push(usersDoc);
                                    return Promise.all(usersDoc.map(async user => {
                                        var teacherDoc = await employee_model.find({ identification_number: user.userID }).lean().exec();
                                        teachers.push(teacherDoc);
                                    }))
                                }
                                else {
                                    res.status(200).send('There is No Teacher User')
                                }
                            })

                    }))
                    .then(() => {
                        res.status(201).send({ Teachers: teachers.flat(Infinity), TeacherUser: teachersUsers.flat(Infinity) })

                    })
            }
            else {
                res.status(200).send('There is No Teacher User')
            }
        }).catch(err => {
            console.log(err)
            res.status(400).send('There is No Teacher User')
        })

};

module.exports = {
    employee_index, employee_create, employee_addTeacherFromExcel, employee_edit, employee_update, employee_delete, addOneEmployee, get_Manager_Data, getTeachers
};