var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', messageController.messageList_get);

router.get('/sign-up', userController.create_get);
router.post('/sign-up', userController.create_post);

router.get('/log-in', userController.logIn_get);
router.post('/log-in', userController.logIn_post);

module.exports = router;
