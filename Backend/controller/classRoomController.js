const Room = require('../model/classRoom').classRoom_model;
const randomstring = require('randomstring');

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

const index = async (req,res) => {
    try {

        let classesRoom= await  Room.find();
        return res.status(200).json({classesRoom});
      } catch (error) {
          console.log(error.toString());
          res.status(400).send("can not find classes")
      }
      };
   
    
    


const create = async (req,res) => {
    res.send('Class Room index');
};

const store = async (req,res) => {
    let {className, classID, teacherID, subjectID, semester} = req.body;

    try {
        let room_code = randomstring.generate(7);

        let newClassRoom = await Room.create({ room_code, classID, teacherID, subjectID, classRoomName: className, semester});

        res.status(201).json({ newClassRoom: newClassRoom._id });
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
    index, create, store, edit, update, destroy
};