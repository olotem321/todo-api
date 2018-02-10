var mongoose = require('mongoose');

var uri = 'mongodb://localhost:27017/TodoApp';

if(process.env.NODE_ENV === 'production'){
  uri = 'mongodb://olotem321:tay13211@ds231228.mlab.com:31228/todoapp';
}


mongoose.Promise = global.Promise;
mongoose.connect(uri);

module.exports ={
  mongoose
}
