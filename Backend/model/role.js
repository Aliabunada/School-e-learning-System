const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const role = Schema({

    name: {
        type: String,
        // unique: [true, 'Role Already exist'],
        required: true
    },
    permissions_id: {
        type: ObjectID,
        required: true
    },

})
const role_model = mongoose.model('role_model', role);
exports.role_model = role_model
exports.roleschema = role;
