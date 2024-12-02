const model = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// index page
const index = (req, res) => {res.render('index')};

// login logic
const login = async(req, res) => {
  const{email, password} = req.body

  try{
    const user = await model.findOne({email:email})
    if(!user){
      throw new Error("No User Found!")
    }

    // compare password
    console.log(user.password)
    const isMatch = await bcrypt.compare(user.password, password)
    if(!isMatch){
      throw new Error("Wrong Password")
    }
    res.send(isMatch)
    
  }catch(err){
    res.json({error:err.message})
  }
}

// signup logic
const signup = async(req, res) => {
  const {username, email, password} = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
      const newUser = await model.create({username:username, email:email, password:hashedPassword})
      if(!newUser){
        throw new Error('Internal Server error')
      }
      res.json(newUser)
  } catch (err) {
    res.json({error:err.message})
  }
}

// export modules
module.exports = {
  index,
  login,
  signup
};
