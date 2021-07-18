const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var subjects = ['الصحة والبيئة','الكيمياء','الفيزياء','الاحياء','الجغرافيا','التاريخ','التربية الوطنية','اللغة الانجليزية','التربية الاسلامية','العلوم','الرياضيات','اللغة العربية','التكنولوجيا','الحاسوب','الثقافة العامة']
const Subject = Schema({
    
    subjectName :{
        type: String,
        required: true
    },
    subject: [{    
                  url : {
                      type : String,
                  },
                  pdf : {
                      type : String,
                  }
    }],
    level :{
        type: String,
        required: true
    },
    branch:{
        type: String,
    },
   
    //add new field to store if the material URL
   
}, { timestamps: true })
const Subject_model = mongoose.model('Subject_model', Subject);
exports.Subject_model = Subject_model
exports.Subjectschema = Subject;
exports.subjects =subjects;

