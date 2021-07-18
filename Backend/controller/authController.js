const User = require('../model/user');
const School = require('../model/school').Schoolmode;
const Role = require('../model/role').role_model;
const Permissions = require('../model/permission').permissions_model;
const EmployeeModal = require('../model/employee').employee_model;
var notUndefinedNotNull = require('../helper/classfun').notUndefinedNotNull
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    const errors = { email: '', password: '' };

    // Incorrect Email When Login
    if (err.message === 'Incorrect Email') {
        errors.email = 'The email is not registered';
    }

    // Incorrect Password When Login
    if (err.message === 'Wrong Password') {
        errors.password = 'The password is incorrect';
    }

    // Duplicate error code
    if (err.code === 11000) {
        errors.email = 'Already Exist';
        return errors;
    }

    // Validations Errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'Mhmod nodejs course', {
        expiresIn: maxAge
    });
};

const auth_singup = (req, res) => {
    res.status(200).send("helll")
    // return 'signup';
};

const auth_login = (req, res) => {
    res.send('Login View');
};
// add if the db has school is  convert to dashboard directly or login page
const auth_signup_post = async (req, res) => {
    var Id = {}
    return User.findOne({ userID: req.body.identification_number })
        .then(async function (admin) {
            if (notUndefinedNotNull(admin)) {
                res.status(400).send('The User was Existed');
            }
            else {
                console.log(req.body);
                const { identification_number, full_name_ar, full_name_en, date_Of_birth, gender, email, job_Number, address, phone_number, password, school_Name, ministry } = req.body;
                const permission = new Permissions({ edit_employees: true, edit_students: true, edit_parents: true, add_subjects: true, edit_classRoom: true, manage_classRoom: true })
                return permission.save()
                    .then(async function (permission) {
                        Id.permission_id = permission._id;
                        const role = new Role({ name: "Admin", permissions_id: permission._id })
                        return await role.save()
                            .then(async function (role) {
                                Id.role_id = role._id;
                                const user = new User({ email: email, password: password, userID: identification_number, username: full_name_ar, role_Id: role._id })
                                return await user.save()
                                    .then(async function (user) {
                                        Id.user_id = user._id;
                                        const newEmploye = new EmployeeModal({ identification_number, full_name_ar, full_name_en, job_Number, gender, address, date_Of_birth, phone: phone_number })
                                        return newEmploye.save()
                                            .then(async function (doc) {
                                                Id.emoloyee_id = doc._id;
                                                const school = new School({ school_Name, ministry, phone_number, managerId: doc._id });
                                                return school.save()
                                                    .then(async function (school) {
                                                        const token = createToken(user._id);
                                                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
                                                        res.status(201).json({ manager: Id.emoloyee_id })
                                                    })
                                            })

                                    })
                            })
                    }).catch(async function (err) {
                        console.dir(err)
                        if (notUndefinedNotNull(Id.user_id)) {
                            await User.deleteOne({ _id: Id.user_id }).exec();
                        }
                        if (notUndefinedNotNull(Id.permission_id)) {
                            await Permissions.deleteOne({ _id: Id.permission_id }).exec();
                        }
                        if (notUndefinedNotNull(Id.role_id)) {
                            await Role.deleteOne({ _id: Id.role_id }).exec();
                        }
                        if (notUndefinedNotNull(Id.emoloyee_id)) {
                            await EmployeeModal.deleteOne({ _id: Id.emoloyee_id })
                        }
                        const errors = handleError(err);
                        res.status(400).send('Failed Insert New School');

                    })

            }
        })


};

const auth_login_post = async (req, res) => {
    const { username, password } = req.body;

    if (validateEmail(username)) {
        try {
            const user = await User.loginUseEmail(username, password);
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(201).json({ user: user._id });
        }
        catch (err) {
            const errors = handleError(err);
            res.status(400).json({ errors });
        }
    } else if (!isNaN(username)) {
        try {
            const user = await User.loginUsID(username, password);
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(201).json({ user: user._id });
        }
        catch (err) {
            const errors = handleError(err);
            res.status(400).json({ errors });
        }
    } else {
        res.send('Unnone');
    }
};

const auth_logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const validate = (req, res) => {
    console.log(validateEmail('anystring@anystring.'));
};

module.exports = {
    auth_singup, auth_login, auth_signup_post, auth_login_post, auth_logout
};