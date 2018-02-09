var mongoose = require('mongoose');

var uri = 'mongodb://olotem321:tay13211@ds231228.mlab.com:31228/todoapp';

mongoose.Promise = global.Promise;
mongoose.connect(uri ||'mongodb://localhost:27017/TodoApp');

module.exports ={
  mongoose
}
