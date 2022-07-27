/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// POST /api/users/register
router.post('/register', async (req,res,next)=>{
    
    try{

        const {username,password} = req.body;
        if (password.length < 8){
            next({name: "passwordLengthError",
            message: "The password is not long enough"})
        }
        const _user = await getUserByUsername(username)
        if (_user){
            next({name: "userExistsError",
            message: "Username already registered"}
            )
        }

        const user = await createUser({username,password})
        console.log(user,"XXXX")

        const token = jwt.sign(
            {
              id: user.id,
              username,
            },
            process.env.JWT_SECRET,
          );

          res.send({
            message: "thank you for signing up",
            token,
            user
          });
    }catch ({name,message}){
        next({name,message})
    }

})
const {username,password} = 
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
