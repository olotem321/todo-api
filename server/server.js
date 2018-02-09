var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
      res.send(doc);
  }, (err) => {
      res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((doc) => {
    res.send({
      doc
    });
  }, (err) => {
    console.log(err);
  });
});

app.get('/todos/:id', (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    console.log(err);
    res.status(400).send('No');
  })
});

app.listen(port, () => {
  console.log(`Start on port ${port}`);
});

module.exports = {
  app
};

//
// var newUser = new User({
//   email: 'olotem321@jotmailc.om'
// });
//
// newUser.save().then((res) => {
//   console.log('Save to User: ', res);
// }, (err) => {
//   console.log('Unable to save to DB');
// });

// var newTodo = new Todo({
//   text: 'Cook dinner'
// });

// var newTodo = new Todo({
//   text: soemidtjsdpoc
//
// })

// newTodo.save().then((result) => {
//   console.log('Save TODO: ', result);
// }, (err) => {
//   console.log('Unable to save TODO');
// })
