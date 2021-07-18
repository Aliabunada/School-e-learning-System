const { response } = require('express');
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/signup', authController.auth_singup);

router.get('/login', authController.auth_login);

router.post('/signup', authController.auth_signup_post);

router.post('/login', authController.auth_login_post);

router.get('/logout', authController.auth_logout);

router.get('/hi',(req,res)=>console.dir('hi'))

module.exports = router;