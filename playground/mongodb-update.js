// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Uable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

// db.collection('Todos').findOneAndUpdate({
//   _id: new ObjectID('5a7d15c654782f726d9f094b')
// }, {
//   //We need to use $set operator to update record
//   $set: {
//     completed:true
//   }
// }, {
//   returnOriginal: false
// }).then((result) => {
//   console.log(JSON.stringify(result, undefined, 2));
// });

db.collection('Users').findOneAndUpdate({
  _id: new ObjectID('5a7be6c3d6d026166e18afd5')
}, {
  $set: {
    name: 'TTay'
  },
  $inc: {
    age: 1
  }
},{
  returnOriginal:false
}).then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
});


  db.close();

});
