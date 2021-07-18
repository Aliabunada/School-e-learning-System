const mongoose = require('mongoose');
const { ObjectID } = require('bson');
const parent = require('./parent').parentschema
const classschema = require('./class').Classschema

const Schema = mongoose.Schema;

const Studentschema = Schema({
    identification_number :{
        type: Number,
        required: true,
        unique : true
    },
    parent_id :{
        type:  ObjectID,
    },
    full_name_ar :{
        type: String,
        required: true
    },
    full_name_en :{
        type: String,
    },
    phone_number :{
        type: Number,
        required: true
    },
    birthday_date :{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        require:true
    },
    classforignkey:{
        type: ObjectID,
    },
    address :{
        type: String,
        require : true
    },
    nationality:{
        type : String
    },
    religion:{
        type : String
    }

}, { timestamps: true })

const Studentmode = mongoose.model('Studentmode', Studentschema);
exports.Studentmode = Studentmode
exports.Studentschema = Studentschema;
