const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// add classes
var className = ['الاول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر','الحادي عشر','الثاني عشر']

const Classschema = Schema({
    level :{
        type: String,
        required: true,
       
    },
    branch :{
        type: String,
    },
    grade :{
        type: String,
        required: true
    },

}, { timestamps: true })
const Class_model = mongoose.model('Class_model', Classschema);
exports.Class_model = Class_model
exports.Classschema = Classschema;
exports.calasses =className
