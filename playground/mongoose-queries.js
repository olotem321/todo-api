const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5a7d3b597147f61b173329c1';
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((res) => {
//   console.log('Todos: ', res);
// },(err) => {
//   console.log('Unable to find!');
// });
//
// Todo.findOne({
//   _id:id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// },(err) => {
//   console.log('Unable to findOne!');
// });

// Todo.findById(id).then((res) => {
//   if(!res){
//     return console.log('Cannot find ID: ', id);
//   }
//   console.log('Find By Id: ', res);
// },(err) => {
//   console.log('Unable to findById!');
// });

User.findById(id).then((res) => {
  if(!res){
    return console.log('User is not found!');
  }
  console.log('Successfully found the User: ', res);
}).catch((e) => {
  console.log('Error occur: ', e);
})
