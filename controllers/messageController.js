const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.messageList_get = async (req, res, next) => {
  try {
    const messages = await Message.find().exec();
    res.render('index', {
      title: 'MembersOnly',
      user: req.user,
      messages: messages
    });
  } catch (err) {
    return next(err);
  }
};
