const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'one@test.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'two@test.com',
  password: 'userTwoPass'
}];

const todos = [{
  _id: new ObjectID,
  text: 'Fisrt test todo'
},{
  _id: new ObjectID,
  text: 'Second test todo',
  completed: true,
  completedAt: 333
},{
  _id: new ObjectID,
  text: 'Third test todo'
}];

const populateTodo = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    done();
  })
};

const populateUser = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {
  todos,users,
  populateTodo,populateUser
}
