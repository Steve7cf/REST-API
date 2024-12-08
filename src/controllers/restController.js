const model = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// index page
const index = (req, res) => {res.render('index')};
const home = (req, res) => {res.render('home')}
const login = (req, res) => {res.render('login')}
const signup = (req, res) => {res.render('signup')}

// login logic
const auth = async(req, res) => {
  const{email, password} = req.body

  try{
    const user = await model.findOne({email:email})
    if(!user){
      throw new Error("No User Found!")
    }

    await bcrypt.compare(password, user.password, async (err, valid) => {
      if(err){
        throw new Error("Internal Error Occured!")
      }
      if(valid){
         jwt.sign({id:user.id},process.env.ACCESS_TOKEN, {expiresIn:60 * 1000}, (err, token) =>{
          if(err){
            throw new Error("Internal Error Occured!")
          }

          if(token){
            res.cookie('token',token , {maxAge:60 * 1000, secure:false, httpOnly:true})
            res.auth = true  
            return res.redirect("/home")
          }
        })
      }
      if(!valid){
        throw new Error("Invalid Password!")
      }
    })


  }catch(err){
    res.json({error:err.message})
    return res.redirect('/login')
  }
}

// signup logic
const create = async(req, res) => {
  const {username, email, password} = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
      const newUser = await model.create({username:username, email:email, password:hashedPassword})
      if(!newUser){
        throw new Error('Internal Server error')
      }
      return res.redirect("/login")
  } catch (err) {
    res.json({error:err.message})
    return res.redirect('/signup')
  }
}

// export modules
module.exports = {
  index,
  login,
  signup,
  home,
  auth,
  create
};
