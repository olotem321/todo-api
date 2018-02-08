// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Uable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

//DELETE MANY
// db.collection('Todos').deleteMany({text:'eat lunch'}).then((result) => {
//   console.log(result);
// }, (error) => {
//   console.log('Error: ', error);
// } )


//DELETE ONE
// db.collection('Todos').deleteOne({text: 'eat lucnch'}).then((result) => {
//   console.log(result);
// });



//FIND ONE AND DELETE
db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
  console.log(result);
})


  db.close();

});
