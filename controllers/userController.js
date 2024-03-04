const User = require('../models/user');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const { body, validationResult } = require('express-validator');

exports.create_get = (req, res, next) => {
  res.render('sign_up', {
    title: 'Sign Up',
  });
};

exports.create_post = [
  body('fname', 'first name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lname', 'last name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('username', 'name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value) => {
      const alreadyExist = await User.find({ username: value }).exec();
      if (alreadyExist) {
        throw new Error('this username is already taken');
      } else {
        return true;
      }
    }),
  body('password', 'password must be at least 4 characters long')
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body('confirmPassword', 'passwords does not match')
    .trim()
    .escape()
    .custom(async (value) => {
      const match = value === req.body.password;
      if (!match) {
        throw new Error('Passwords does not match');
      } else {
        return true;
      }
    }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        const user = new User({
          firstName: req.body.fname,
          lastName: req.body.lname,
          username: req.body.username,
          password: req.body.password,
        });

        if (!errors.isEmpty()) {
          res.render('sign_up', {
            title: 'Sign-Up',
            fname: user.firstName,
            lname: user.lastName,
            username: user.username,
            password: user.password,
          });
        } else {
          await item.save();
          res.redirect('/');
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];
