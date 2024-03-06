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
      const alreadyExist = await User.findOne({ username: value }).exec();
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
    .custom((value, { req }) => {
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
          password: hashedPassword,
          membership: false,
        });

        if (!errors.isEmpty()) {
          console.log(errors);
          res.render('sign_up', {
            title: 'Sign-Up',
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            errors: errors.array(),
          });
        } else {
          await user.save();
          res.redirect('/');
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log(username, password);
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    return done(err);
  }
});

exports.logIn_get = (req, res, next) => {
  const error =
    undefined === req.session.messages
      ? undefined
      : req.session.messages.slice(-1);
  res.render('log_in', {
    title: 'Log In',
    error: error,
  });
};

exports.logIn_post = [
  passport.authenticate('local', {
    failureRedirect: 'log-in',
    failureMessage: true,
  }),
  (req, res, next) => {
    res.redirect('/');
  },
];
