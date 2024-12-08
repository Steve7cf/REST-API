const model = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// index page
const index = (req, res) => {
  res.render("index");
};

// home page
const home = (req, res) => {
  if (req.session.isAuth) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
};


// login page
const login = (req, res) => {
  const info = req.flash('message')
  res.render("login", {info});
  console.log(info)
};

// signup page
const signup = (req, res) => {
  res.render("signup");
};

// login logic
const auth = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user using email
    const user = await model.findOne({ email: email });
    if (!user) {
      req.flash("message", "Invalid Credentials!")
      return res.redirect("/login")
    }

    // compare hash and password
    await bcrypt.compare(password, user.password, async (err, valid) => {
      if (err) {
        req.flash("message", "Internal Error!")
        return res.redirect("/login")
      }
      if (valid) {
        // create jwt token
        jwt.sign(
          { id: user.id },
          process.env.ACCESS_TOKEN,
          { expiresIn: 60 * 1000 },
          (err, token) => {
            // look for errors in jwt creation
            if (err) {
              req.flash("message", "Internal Error!")
              return res.redirect("/login")
            }
            //create cookie and sessions and redirect to home
            if (token) {
              res.cookie("token", token, {
                maxAge: 60 * 1000,
                secure: false,
                httpOnly: true,
              });
              req.session.isAuth = true;
              return res.redirect("/home");
            }
          }
        );
      }
      if (!valid) {
        req.flash("message", "incorrect password")
        return res.redirect("/login")
      }
    });
  } catch (err) {
    req.flash("message", `${err.message}`)
    return res.redirect("/login");
  }
};

// signup logic
const create = async (req, res) => {
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await model.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    if (!newUser) {
      req.flash("message", "Internal Error!")
              return res.redirect("/login")
    }
    return res.redirect("/login");
  } catch (err) {
    req.flash("message", "Internal Error!")
    return res.redirect("/signup")
  }
};

// logout
const logout = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        req.flash("message", "Internal Error!")
        return res.redirect("/login")
      }
      res.clearCookie('token'); // Clear the session cookie
      res.redirect('/login'); // Redirect to the login page
  });
  } catch (error) {
    req.flash("message", `${err.message}`)
    res.redirect("/")
  }
}

// export modules
module.exports = {
  index,
  login,
  signup,
  home,
  auth,
  create,
  logout
};
