const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.messageList_get = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .populate('author')
      .exec();
    res.render('index', {
      title: 'MembersOnly',
      user: req.user,
      messages: messages,
    });
  } catch (err) {
    return next(err);
  }
};

exports.messagesFiltered_get = [
  async (req, res, next) => {
    try {
      console.log(11111, req.query);
      const messages = await Message.find({
        $text: { $search: req.query.search },
      })
        .populate('author')
        .exec();
      res.render('index', {
        title: 'MembersOnly',
        user: req.user,
        messages: messages,
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.create_get = (req, res, next) => {
  res.render('message_form', {
    user: req.user,
  });
};

exports.create_post = [
  body('title', 'title must not be empty').trim().escape().isLength({ min: 1 }),
  body('text', 'text must not be empty').trim().escape().isLength({ min: 1 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('message_form', {
          user: req.user,
          errors: errors.array(),
          title: req.body.title,
          text: req.body.text,
        });
      } else {
        const message = new Message({
          title: req.body.title,
          text: req.body.text,
          author: req.user,
        });
        await message.save();
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_get = (req, res, next) => {
  res.render('message_delete', {
    user: req.user,
  });
};

exports.delete_post = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    await Message.findByIdAndDelete(messageId).exec();
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
};
