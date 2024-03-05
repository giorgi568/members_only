var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'MembersOnly' });
});

router.get('/sign-up', userController.create_get);
router.post('/sign-up', userController.create_post);

module.exports = router;
