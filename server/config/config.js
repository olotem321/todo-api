var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env == 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if(process.env.NODE_ENV === 'production'){
  process.env.MONGODB_URI = 'mongodb://olotem321:tay13211@ds231228.mlab.com:31228/todoapp';
}
