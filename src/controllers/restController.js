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
    const match = await bcrypt.compare(user.password, password)
    console.log(match)

  }catch(err){
    res.json({error:err.message})
  }
}

// signup logic
const signup = async(req, res) => {
  const {username, email, password} = req.body
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)

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
