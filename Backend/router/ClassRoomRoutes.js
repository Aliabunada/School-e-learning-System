const express = require('express');
const router = express.Router();
const classRoomController = require('../controller/classRoomController');
const classRoom = require('../model/classRoom');

router.get('/', classRoomController.index);

router.get('/create', classRoomController.create);

router.post('/store', classRoomController.store);

router.get('/:id/edit', classRoomController.edit);

router.put('/:id', classRoomController.update);

router.delete('/:id', classRoomController.destroy);

module.exports = router;