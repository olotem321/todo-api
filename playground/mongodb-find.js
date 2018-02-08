// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Uable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5a7beb6d79cbdb2a9aa96dfb')
  // }).toArray().then( (docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to to fetch toods', err);
  // });

//GET COUNT
  db.collection('Todos').find().count().then( (count) => {
    console.log('Todos count: ', count);
  }, (err) => {
    console.log('Unable to to fetch toods', err);
  });


//GET RECORD
  db.collection('Users').find({
    name:'Jboi'
  }).toArray().then((docs) => {
    console.log('---USERS---');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch record:',err);
  })

  db.close();

});
