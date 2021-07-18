const employee_model = require('../model/employee').employee_model;
const xlsxFile = require('read-excel-file/node');
const Permissions = require('../model/permission').permissions_model;
const validUrl = require('valid-url');
const User_model = require('../model/user');
const role_model = require('../model/role').role_model
const notUndefinedNotNull = require('../helper/classfun').notUndefinedNotNull;
const fs = require('fs');
const moment = require('moment')

async function readExcelFile (passwordTeacher,req){
let result = [];
let rows =   await  xlsxFile(process.env.UPLOAD_EMPLOYEE_FOLDER + req.file.filename)
    rows.shift();
    if (notUndefinedNotNull(rows)) {
        //  rows.forEach(async(col, i) => {
         for (const col of rows){
            if (notUndefinedNotNull(col)) {
                for (var i = 0; i < col.length; i++) {
                    teacherData = {
                        identification_number: col[0],
                        full_name_ar: col[1],
                        job_Number: col[2],
                        full_name_en: col[3],
                        gender: col[3],
                        date_Of_birth: col[9],
                        social_Status: col[10],
                        address: col[11],
                        phone: col[13],
                        teaching_Subject: col[32],
                    }
                
                }
                // var student = {};
               let isCheckTeacher = await checkTeacher(teacherData);
               if(isCheckTeacher){
                   continue;
               }
               let createTeacher = await saveTeacher(teacherData)
               let storePermissionAndUser = await  savePermission(teacherData,passwordTeacher)
               result.push(storePermissionAndUser)
            }
            
           
        }
       
       
    }
   
}
async function checkTeacher(teacherData){
    let teacher = await employee_model.findOne({ identification_number: teacherData.identification_number })
    if (notUndefinedNotNull(teacher)) {
            return true;
        }
        return false;           
}
 const saveTeacher = async (teacherData)=>{
    var newTeacher = new employee_model(teacherData)
   await newTeacher.save();
   return newTeacher;
}
const savePermission = async (teacherData,passwordTeacher)=>{
    const permission = new Permissions({ edit_employees: false, edit_students: true, edit_parents: false, add_subjects: true, edit_classRoom: true, manage_classRoom: false })
    let permissionDoc =  await permission.save()
    if(permissionDoc){
        const role = new role_model({ name: "Teacher", permissions_id: permissionDoc._id })
        let roleDoc = await role.save();
        const user = new User_model({ password: '123456', userID: teacherData.identification_number, username: teacherData.full_name_ar, role_Id: roleDoc._id })
        
      return await user.save();

    }
}
module.exports = {readExcelFile}
