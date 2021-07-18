const { ObjectID } = require('bson');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classRoom = Schema({
    room_code :{
        type: String,
        required: true
    },
    classID :{
        type: ObjectID,
        required: true
    },
    teacherID :{
        type: ObjectID,
        required: true
    },
    subjectID :{
        type: String,
        required: true
    },
    classRoomName :{
        type: String,
        required: true
    },
    semester :{
        type: String,
        required: true
    }
}, { timestamps: true })
const classRoom_model = mongoose.model('classRoom_model', classRoom);
exports.classRoom_model = classRoom_model
exports.classRoomschema = classRoom;
