const Subject = require('../model/subject');
const Permissions = require('../model/permission').permissions_model;
const validUrl = require('valid-url');

const handleError = (err) => {
    const errors = {  };

    // Duplicate error code
    if(err.code === 11000) {
        errors.email = 'Role name already exist';
        return errors;
    }

    // Validations Errors
    if(err.message.includes('permissions_model validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const subject_index = (req,res) => {
    res.send('Subjects Index Page');
};

const subjectsListName = (req,res) => {
    
    res.status(200).send({SubjectList:Subject.subjects});
};

const subject_create = (req,res) => {
    res.render('index.html');
};

const subject_UploadMaterial = async (req,res) => {
    const {subject_name, subject, level} = req.body;
    try{
        if (validUrl.isUri(subject)){
            const newSubject = await Subject.Subject_model.create({ subjectName: subject_name, subject: subject, level: level });
            res.status(201).json({ newSubject: newSubject._id });
        } else {
            res.status(400).send({ error: "Please check the URL again" })
        }
        
    } catch(err) {
        res.status(400).send({ error: error.message })
    }
}

const subject_edit = (req,res) => {
    res.send(req.params.id);
};

const subject_update = async (req,res) => {
    const roleID = req.params.id;
    const role = await Role.findOne({_id: roleID});    

    try{
        const permissionID = role.permissions_id;
        const permission = await Permissions.findOne({_id: permissionID});
        permission.edit_employees =  req.body.edit_employees;
        permission.edit_students = req.body.edit_students;
        permission.edit_parents = req.body.edit_parents;
        permission.edit_sections = req.body.edit_sections;
        permission.edit_materials = req.body.edit_materials;
        await permission.save();
        try {
            role.name = req.body.name;
            await role.save();
            res.status(201).json({ role, permission });
        } catch(err) {
            const errors = handleError(err);
            res.status(400).json({errors});
        }
    } catch(err) {
        const errors = handleError(err);
        res.status(400).json({errors});
    }
};

const subject_delete = async (req,res) => {
    const roleID = req.params.id;
    const role = await Role.findOne({_id: roleID});    

    try{
        const permissionID = role.permissions_id;
        await Permissions.findByIdAndDelete({_id: permissionID});
        try {
            await Role.findByIdAndDelete({_id: roleID})
            .then(result => {
                // res.status(201).json({ redirect: '/url' });
                res.send('Deleted Successfully');
            });
        } catch(err) {
            const errors = handleError(err);
            res.status(400).json({errors});
        }
    } catch(err) {
        const errors = handleError(err);
        res.status(400).json({errors});
    }
};


module.exports = {
    subject_index, subject_create, subject_UploadMaterial, subject_edit, subject_update, subject_delete,subjectsListName
};