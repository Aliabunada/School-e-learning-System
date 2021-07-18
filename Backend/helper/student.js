const notUndefinedNotNull = require('./classfun').notUndefinedNotNull
const student_model = require('../model/student').Studentmode;
const xlsxFile = require('read-excel-file/node');
const Permissions = require('../model//permission').permissions_model;
const validUrl = require('valid-url');
const User = require('../model//user');
const Role = require('../model//role').role_model;
const Parent = require('../model//parent').parent_model;
const Class_model = require('../model//class').Class_model;
const fs = require('fs');
const path = require("path");
async function readExcelFile (passwordstd,req){
    let result = [];
    console.log(req.file.filename)
    // let filePAth = path.join(path.dirname("/upload/student"),req.file.filename)
    // process.env.UPLOAD_FOLDER+'/student/' + req.file.filename
    let rows =   await  xlsxFile( process.env.UPLOAD_STUDENT_FOLDER + req.file.filename)
        rows.shift();
        rows.shift();
        rows.shift();

        var studentData, parentdata, classdata = {}
        if (notUndefinedNotNull(rows)) {
            //  rows.forEach(async(col, i) => {
             for (const col of rows){
                if (notUndefinedNotNull(col)) {
                    for (var i = 0; i < col.length; i++) {
                        studentData = {
                            identification_number: col[1],
                            full_name_ar: col[2],
                            full_name_en: col[3],
                            phone_number: col[11],
                            birthday_date: col[4],
                            gender: col[6],
                            address: col[10],
                            nationality: col[8],
                            religion: col[7]
                        }
                        parentdata = {
                            identification_number: col[16],
                            full_name_ar: col[17],
                            phone: col[11],
                            Job: col[19]
                        }
                        classdata = {
                            level: col[13],
                            grade: col[15],
                            branch: col[14]
                        }

                    }
                    // var student = {};
                   
                        
                }
                let isClassDefined = await checkClass(studentData,classdata);
                if(!isClassDefined){
                    throw new Error("class not found");
                }
               let isStudentDefined= await checkStd(studentData,parentdata,classdata);
                if(isStudentDefined){
                    continue;
                }
                let checkParentStudent = await checkParent(studentData,parentdata);
                let finalResult=  await setPermissionAndRole(studentData,result,passwordstd);
                return finalResult;
            }
           
           
        }

   
}
 async function checkStd(studentData,parentdata,classdata){
    let std = await student_model.findOne({ identification_number: studentData.identification_number })
       
    if (notUndefinedNotNull(std)) {
            return true;
        }
        return false;           
}

let checkClass = async (studentData,classdata)=>{
    let classlevel = await Class_model.findOne({ level: classdata.level })
        console.log('h2');
        if (notUndefinedNotNull(classlevel)) {
            console.log('h2 if');
            studentData.classforignkey = classlevel._id  
            return studentData;                 
        }
        else {            
           return null;           
        }

}
async function checkParent(studentData,parentdata){
   let parent =  await Parent.findOne({ identification_number: parentdata.identification_number })
        console.log('h3');
        if (notUndefinedNotNull(parent)) {
            studentData.parent_id = parent._id
            console.log('h3 if');            
        }
        else {
            var newparent = new Parent(parentdata)
            newparent.save()
                .then(async function (parent) {
                    studentData.parent_id = parent._id
                    console.log('h2 else');
                })
        }
        var newstd = new student_model(studentData)
       let std = await newstd.save();
                console.log('h33');
        return std;    
       
}
 async function setPermissionAndRole(studentData,result,passwordstd){

    const permission = new Permissions({ edit_employees: false, edit_students: false, edit_parents: false, add_subjects: false, edit_classRoom: false, manage_classRoom: false })
    let permissionDoc = await permission.save()
    if(permissionDoc){
            console.log('h4');
            const role = new Role({ name: "Student", permissions_id: permissionDoc._id })
            let roleDoc =  await role.save();
            if(roleDoc){
                    console.log('h5');
                    const user = new User({ password: passwordstd, userID: studentData.identification_number, username: studentData.full_name_ar, role_Id: roleDoc._id })
                     await user.save()
                    if(user){
                            console.log('h6');
                            console.log('success ^_^')
                            result.push(user._id)
                    }
                }
    }
    return result;
       
 }
 module.exports={readExcelFile}