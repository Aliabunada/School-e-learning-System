const express = require("express");
var app = express();
const cors = require('cors');
const dotenv = require('dotenv').config()
var path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const AuthRoutes = require('../router/AuthRoutes');
const RoleRoutes = require('../router/RoleRoutes');
const SubjectRoutes = require('../router/SubjectRoutes');
const EmployeeRoutes = require('../router/EmployeeRoutes');
const studenteeRoutes = require('../router/studentRoutes');
const classRouters = require('../router/classRouters');
const classRoomRoutes = require('../router/ClassRoomRoutes');
const classRoomTutorialRoutes = require('../router/ClassRoomTutorialRoutes');
const SubMaterialRoutes = require('../router/SubMaterialRoutes');
var morgan = require('morgan')


// connecting DB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DataBase Connected Successfully ^_^ !!!'));
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log("connect to DB success !*_*");
});

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());  // to recive data as objects or arrays from front
app.use(cors()); // to connect frontend with backend

// Have Node serve the files for our built React app
app.use(express.static(path.join(__dirname,"../../online-school-system/build")));

// app.use(express.static('publi  c'));

//body-parser
// app.use(express.urlencoded()); 

app.use('/',AuthRoutes);

app.use('/role', RoleRoutes);

app.use('/subject', SubjectRoutes);

app.use('/employee', EmployeeRoutes);

app.use('/students', studenteeRoutes);

app.use('/classes', classRouters);

app.use('/classRoom', classRoomRoutes);

app.use('/tutorial', classRoomTutorialRoutes);

app.use('/subMaterial', SubMaterialRoutes);

app.get('/hhh',(req,res,next)=>{console.dir("testget"); next();},async function(req,res){
  console.log('hhhh');
  res.status(200).json({data:'hi'})
}),


app.use(methodOverride('_method'));

// All other GET requests not handled before will return our React app
app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../online-school-system/build', 'index.html'));
});

let port = process.env.PORT || 8000;
app.listen(port, () => console.log(`work on ${port}`));