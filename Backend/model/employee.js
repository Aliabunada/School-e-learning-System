const mongoose = require('mongoose');
const role = require('./role').roleschema
const Schema = mongoose.Schema;

const employee = Schema({
    
    identification_number :{
        type: Number,
        required: true
    },
    full_name_ar :{
        type: String,
        required: true
    },
    full_name_en :{
        type: String,
       
    },
    // the roles in the user
    job_Number :{
        type: Number,
        required: true
    },
    gender :{
        type: String,
        required: true
    },
    social_Status :{
        type: String,
        // required: true
    },
    address :{
        type: String,
        // required: true
    },
    date_Of_birth :{
        type: Date,
        // required: true
    },
    phone :{
        type: Number,
        // required: true
    },
    teaching_Subject :{
        type: String,
    },

   
})
const employee_model = mongoose.model('employee_model', employee);
exports.employee_model = employee_model
exports.employeeschema = employee