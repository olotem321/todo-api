const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
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

app.delete('/todos/:id', (req, res) => {
  //Get the ID
  var id = req.params.id;


  //Validate the ID
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //REMOVE THE DOC
  Todo.findByIdAndRemove(id).then((todo) => {
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
app.patch('/todos/:id', (req,res) => {
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

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  });

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
