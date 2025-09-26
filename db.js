const mongoose = require('mongoose');

//Define mongoDB url
const  mongourl = 'mongodb://localhost:27017/BookStore';

//Set up mongodb connection
mongoose.connect(mongourl);

//Mongoose basically maintains a default object to represent the mongodb connection
const db = mongoose.connection;

db.on('connected' , ()=>{
      console.log('Connected successfully');
});
db.on('disconnected' , ()=>{
      console.log(' Disconnected');
});
db.on('error' , ()=>{
      console.log('Error occurred');
});

module.exports  = db ;


//db file ka kaam sirf aur sirf connection ko establish karna hai between nodejs application and mongodb database thats it..!
