var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });

}
if(process.env.NODE_ENV === 'production'){
  process.env.MONGODB_URI = 'mongodb://olotem321:tay13211@ds231228.mlab.com:31228/todoapp';
}
