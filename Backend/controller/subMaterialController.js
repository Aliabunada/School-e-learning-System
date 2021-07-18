const Room = require('../model/classRoom').classRoom_model;
const sub_material = require('../model/sub_material').sub_material_model;
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

const index = (req,res) => {
    res.send('Tutorial Index Page');
};

const create = async (req,res) => {
    console.log(req.params);
    res.send(req.params);
};

const uploadFileLink = async (req,res) => {
    let {title, description, material, teacherID, subjectID, classRoomID} = req.body;
    
    try {
        if (validUrl.isUri(material.url)){
            const newMaterial = await sub_material.create({ title: title, description, material: { url: material.url }, teacherID, SubjectId: subjectID, classRoom: classRoomID});
            res.status(201).json({ newMaterial: newMaterial._id });

        } else {
            res.status(400).send({ error: "Please check the URL again" })
        }
    } catch(error) {
        res.status(400).send({ error: error.message })
    }
}

const edit = async (req,res) => {
    let {classRoomID} = req.params.id;

    try{
        let ClassRoom = await classRoom.findById({ classRoomID });

        res.status(201).json({ ClassRoom });
    } catch(error) {
        res.status(400).send({ error: error.message })
    }
};

const update = async (req,res) => {
    const classRoomID = req.params.id;

    try{
        const room = await Room.findById(classRoomID);

        room.classRoomName =  req.body.className;
        room.classID = req.body.classID;
        room.teacherID = req.body.teacherID;
        room.subjectID = req.body.subjectID;
        room.semester = req.body.semester;
        await room.save();

        res.status(201).json({ room });
    } catch(error) {
        // const errors = handleError(err);
        res.status(400).json({error: error.message});
    }
};

const destroy = async (req,res) => {
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
    index, create, uploadFileLink, edit, update, destroy
};