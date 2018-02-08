// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Uable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Swhid',
  //   completed: false
  // }, (err, res) => {
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log('Successfully insert todo', JSON.stringify(res.ops, undefined, 2));
  //
  // });

  // db.collection('Users').insertOne({
  //   name: 'liza',
  //   age: 1,
  //   location: 'Samed Island'
  // }, (err, res) => {
  //   if(err){
  //     return console.log('Unable to insert Users', err);
  //   }
  //
  //   console.log('Successfully insert Users', JSON.stringify(res.ops, undefined, 2));
  //
  // });

  db.close();

});
