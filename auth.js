const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/User');


passport.use(new LocalStrategy(async (username , password , done) =>{
      // authentication logic here
      try{
            //console.log("Recieved credentials" , username , password);
            const user = await person.findOne({username : username});
            if(!user){
                  return done(null ,false , {message :  "Incorrect username"});
            }
            const isPasswordMatch = await user.comparePassword(password);
            if(isPasswordMatch){
                  return done(null , user);
            }
            else{
                  return done(null ,false , "Invalid password");
            }
      }
      catch(error){
            return done(error);
      }

}));

module.exports = passport ;