const mongoose = require('mongoose');

const bookschema = mongoose.Schema({

      name:{
            type : String ,
            required : true
      },
      authorname:{
            type : String,
      },
      quantity:{
            type : Number,
            required:true,
            default : 10
      }
});

// Create a book model
const Books = mongoose.model('Books' , bookschema);
module.exports = Books;