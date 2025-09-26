const jwt = require('jsonwebtoken');

//Authenticate the user with the help of jwt token
const jwtAuthMiddleware = (req,res,next)=>{
      
      //Extract the jwt token from request header 

      const token = req.headers.authorization.split(' ')[1];
      //If token does not exist
      if(!token) return res.status(401).json({error : "Unauthorized"});

      try{

            //Now verify the token
            const decoded = jwt.verify(token , process.env.JWT_SECRET);

            //Atach user information to the request object 
            req.user = decoded ;
            next();

      }
      catch(error){
            console.error(error);
      }
}

//Function to generate jwt token..userData is payload here
const generateToken = (userData)=>{

      //Generate a new token using user data and secret key
      return jwt.sign(userData , process.env.JWT_SECRET);
}

module.exports = {jwtAuthMiddleware , generateToken};

