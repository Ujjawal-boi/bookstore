const express = require('express');
const router = express.Router();

const User = require('./../models/User');
const{jwtAuthMiddleware , generateToken} = require('./../jwt');

//Create the user
router.post('/signup' ,   async (req ,res)=>{

      try{

            const data = req.body ;

            //Create new user
            const newuser = new User(data);

            const saveduser = await newuser.save();
            console.log("Saved to database");

            const payload = {
                  id : saveduser.id ,
                  userType: saveduser.userType
                  
            }
            const token = generateToken(payload);
            console.log("This is our token : " + token);

            res.status(200).json({saveduser : saveduser , token : token});

      }
      catch(error){

            console.log("Error saving user" , error.message);
            res.status(400).json({message : error.message});
      }


})

//Login user

router.post('/login' ,  async (req, res)=>{

      try{

            //Extract the username and password from the req body 

            const {username , password} = req.body ;

            // Find the user by username
            const user = await User.findOne({username : username});

            //If user does not exist or password does not match return error
            if(!user  || !(await user.comparePassword(password))){

                return  res.status(400).json({message : "Invalid username or password"});
            }
            
            
            const payload = {
                  id : user.id 
            }
            const token = generateToken(payload);
            console.log("This is our token : " + token);

            res.status(200).json({ token : token});


      }
      catch(error){
            console.error(error);
            res.status(500).json({error : "Internal Server Error"});
      }
});

//Access the profile 

router.get('/profile' , jwtAuthMiddleware , async (req,res)=>{
      try{
            const userData = req.user; // decode data

            console.log("User Data is " , userData);

            const userID = userData.id ;
            const user = await User.findById(userID);

            res.status(200).json(user);
      }
      catch(error){
            console.error(error);
            res.status(500).json({error : 'Error internal server'});
      }
});


// Change the password

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // decoded from JWT
    const { oldPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router ;