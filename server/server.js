require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();


app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
      res.send(doc);
  }, (err) => {
      res.status(400).send(err);
  });
});

app.get('/todos', authenticate,  (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((doc) => {
    res.send({
      doc
    });
  }, (err) => {
    console.log(err);
  });
});

app.get('/todos/:id', authenticate,  (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    console.log(err);
    res.status(400).send('No');
  })
});

app.delete('/todos/:id',authenticate,  (req, res) => {
  //Get the ID
  var id = req.params.id;


  //Validate the ID
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //REMOVE THE DOC
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todo) => {
    //IF Todo not found RETURN 404
    if(!todo){
      return res.status(404).send();
    }

    //R
    res.send({todo});

  }).catch((err) => {
    console.log(err);
    res.status(404).send();
  });


});


//Update route
app.patch('/todos/:id',authenticate,  (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text', 'completed']);
   //Validate the ID
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }


  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.complatedAt = null;
  }

  Todo.findOneAndUpdate({
    _id:id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  });

});

//POST /Users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login',(req, res) => {
  var body = _.pick(req.body,['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(401).send();
  });

});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

app.listen(process.env.PORT, () => {
  console.log(`Start on port ${process.env.PORT}`);
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
