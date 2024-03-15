#! /usr/bin/env node

console.log(
  'Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

const userArgs = process.argv.slice(2);
const User = require('./models/user');
const Message = require('./models/message');

const users = [];
const messages = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];
main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createUsers();
  await createMessages();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function userCreate(
  index,
  firstName,
  lastName,
  username,
  password,
  membership
) {
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    membership: membership,
  });

  await user.save();
  users[index] = user;
  console.log('added user: ' + username);
}

async function messageCreate(index, title, text, author) {
  const message = new Message({
    title: title,
    text: text,
    author: author,
  });

  await message.save();
  messages[index] = message;
  console.log('added message: ' + title);
}

async function createUsers() {
  console.log('adding users');

  await Promise.all([
    userCreate(0, 'joe', 'biden', 'sleepyJoe', 'blabla', false),
    userCreate(1, 'john', 'steinbeck', 'tom', 'menandmice', true),
  ]);
}

async function createMessages() {
  console.log('adding messages');

  await Promise.all([
    messageCreate(
      0,
      'future of the union',
      'future of our dear union is bright and full of hope, inspiring!',
      users[0]
    ),
    messageCreate(
      1,
      'state of farmers',
      'big banks throwing working people off their land(its all they have).',
      users[1]
    ),
  ]);
}
