const {calasses, Class_model} = require('../model/class');
const notUndefinedNotNull = require('../helper/classfun').notUndefinedNotNull;



const getClassesName = (req, res) => {
    Grades = ['الابتدائية','الاعدادية','علمي','ادبي','شرعي','صناعة',]
    res.status(201).send({classes:calasses,Grades:Grades});
};

const class_delete = (req,res) =>{
    let level = req.params.id.slice(0,-1)
    let branch = req.params.id.slice(-1);
    return Class_model.findOneAndRemove({branch:branch,level:level})
    .then(async function (classDoc){
        if(notUndefinedNotNull(classDoc)){
            res.status(200).send('The Class was Deleted Successfully')
        }
        else
        {
           
            res.status(400).send('Faild Delete the Class  ')
        
        }
  
    })

}

const getAllClasses = async (req, res) => {
try {

  let classes= await Class_model.find();
  return res.status(200).json({classes});
} catch (error) {
    console.log(error.toString());
    res.status(400).send("can not find classes")
}
};

const getOneClass = (req,res)=>{
    console.log(req.params,'req.params,');
    console.log(req.param,'req.param,');
    // level = req.param.id
    // branch = req.param.id
}

const createClass = (req, res) => {
  
    classData = { level: req.body.level,
                  grade : req.body.grade,
                  branch : req.body.branch }
 return Class_model.findOne({branch:classData.branch,level:classData.level})
  .then(async function (classDoc){
      if(notUndefinedNotNull(classDoc)){
          res.status(400).send('The Class is existed')
      }
      else
      {
          let newClass = new Class_model(classData)
          newClass.save()
          .then((newClassDoc)=>{
              res.status(201).send({msg:'The Class Was Added Successfully'})
          })

      }

  })
};
module.exports = {class_delete,getClassesName,createClass,getAllClasses,getOneClass}