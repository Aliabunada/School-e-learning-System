const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mark = Schema({
    
    studentID :{
        type: ObjectID,
        required: true
    },
    classRoom :{
        type: ObjectID,
        required: true
    },
    firstExamMark :{
        type: Number,
        required: true
    },
    midtermExamMark :{
        type: Number,
        required: true
    },
    finalExamMark :{
        type: Number,
        required: true
    },
    activityMark :{
        type: Number,
        required: true
    },
    created_Date :{
        type: Date,
        required: true
    },
})
const Mark_model = mongoose.model('Mark_model', Mark);
exports.Mark_model = Mark_model
exports.Markschema = Mark;