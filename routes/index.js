var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', messageController.messageList_get);
//for search result
router.get('/messages-filtered', messageController.messagesFiltered_get);

router.get('/sign-up', userController.create_get);
router.post('/sign-up', userController.create_post);

router.get('/log-in', userController.logIn_get);
router.post('/log-in', userController.logIn_post);

router.get('/log-out', userController.logOut_get);

router.get('/membership', userController.membership_get);
router.post('/membership', userController.membership_post);

router.get('/new-message', messageController.create_get);
router.post('/new-message', messageController.create_post);

router.get('/delete-message/:id', messageController.delete_get);
router.post('/delete-message/:id', messageController.delete_post);

module.exports = router;
