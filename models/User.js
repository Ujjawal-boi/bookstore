const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const userschema = new mongoose.Schema({

      name:{
            type:String,
            required : true
      },
      age:{
            type:Number
      },
      email :{
            type:String,
            unique: true
      },
      mobile :{
            type : Number,
            required : true
      },
      userType:{
            type:String ,
            enum :["Seller" , "Admin"],
            required : true
      },
      money:{
            type :Number,
            default : 0
      },
      books:{
            type : String,
            default : "None"
      },
      quantity:{
            type : Number ,
            default : 0
      },
      password:{
            type : String,
            required : true
      }

});


userschema.pre('save' , async function(next){

      const user = this ;

      // hash the password only if it is modified (or is new)
      if(!user.isModified('password')) return next();

      try{
            //salt generation
            const salt = await bcrypt.genSalt(10);

            // hash password 
            const hashedPassword = await bcrypt.hash(user.password , salt );

            //Override the plain password with the hashed one
            user.password = hashedPassword ;

            next();
      }
      catch(error){
            return next(error);
      }
});

userschema.methods.comparePassword = async function(userPassword){

      try{

            // Use bcrypt to compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(userPassword , this.password);
            return isMatch ; 
      }     
      catch(err){
            throw err ;
      }
};


// Create a user model
const User = mongoose.model('User' , userschema);
module.exports = User ;