const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const user = Schema({
    
    email :{
        type: String,
        validate: [isEmail, 'Please enter a valid email']
    },
    username :{
        type: String,
        unique: true,
        lowercase: true,
    },
    userID :{
        type: String,
        unique: true,
    },
    password :{
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 charaters']
    },
    role_Id :{
        type: ObjectID,
        required: true
    },
}, { timestamps: true });

// Fire a function before doc saved to DB
user.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method for user login using Email address
user.statics.loginUseEmail = async function (email, password) {
    const user = await this.findOne({ email });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('Wrong Password');
    }
    throw Error('Incorrect Email');
}

// Static method for user login using ID number
user.statics.loginUsID = async function (IDNumber, password) {
    const user = await this.findOne({ username: IDNumber });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('Wrong Password');
    }
    throw Error('Incorrect ID Number');
}


const user_model = mongoose.model('user_model',user);
module.exports =user_model;
