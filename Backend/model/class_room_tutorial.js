const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const teacher =require('./employee').employeeschema
const section = require('./classRoom').classRoomschema

const Schema = mongoose.Schema;

const classRoom_tutorial = Schema({
    lesson_number : {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    material :{ 
            url : {
                type : String,
                nullable: true
            },
            video : {
                type : String,
                nullable: true
            }
    },
    teacherId :{
        type: ObjectID,
        required: true
    },
    SubjectId:{
        type: ObjectID,
        required : true
    },
    classRoom :[{
        type: ObjectID,
        required: true
    }]
}, { timestamps: true })
const classRoom_tutorial_model = mongoose.model('classRoom_tutorial_model', classRoom_tutorial);
exports.classRoom_tutorial_model = classRoom_tutorial_model
exports.classRoom_tutorial = classRoom_tutorial;
