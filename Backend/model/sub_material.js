const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sub_material = Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacherID :{
        type: ObjectID,
        required: true
    },
    SubjectId:{
        type: ObjectID,
        required : true
    },
    classRoom :{
        type: ObjectID,
        required: true
    },
    material :{
        url : {
            type : String,
        },
        file : {
            type : String,
        }
    }
   
})
const sub_material_model = mongoose.model('sub_material_model', sub_material);
exports.sub_material_model = sub_material_model
exports.sub_materialschema = sub_material;
