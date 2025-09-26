const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./db');

// Instead of body parser we can use this :
app.use(express.json());
app.use(express.urlencoded({extended : true}));  // these lines works same as the body parser


const userRoutes = require('./routes/userRoutes');
app.use('/user' , userRoutes);

const bookRoutes = require('./routes/bookRoutes');
app.use('/books' , bookRoutes);

app.listen(3000 , ()=>{
      console.log("Listening at port 3000 ");
});




