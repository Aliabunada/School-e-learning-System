const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissions = Schema({
    edit_employees: {
        type: Boolean,
        required: [true, 'Please set edit employees value'],
    },
    edit_students: {
        type: Boolean,
        required: [true, 'Please set edit stuednts value'],
    },
    edit_parents: {
        type: Boolean,
        required: [true, 'Please set edit parents value'],
    },
    add_subjects :{
        type: Boolean,
        required: [true, 'Please set add subjects value'],
    },
    edit_classRoom: {
        type: Boolean,
        required: [true, 'Please set edit classRoom value'],
    },
    manage_classRoom: {
        type: Boolean,
        required: [true, 'Please set manage classRoom value'],
    },
})
const permissions_model = mongoose.model('permissions_model', permissions);
exports.permissions_model = permissions_model
exports.permissionschema = permissions;


// need to update