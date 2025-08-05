const User = require("../models/user.js");

module.exports.rendersignUpForm = (req,res) => {
    res.render("./users/signup.ejs");
};

 module.exports.signUp =async(req,res) => {
 try{
  let{username,email,password} = req.body;
  const newUser = new User({username,email});
  let registerUser = await User.register(newUser,password);
  req.login(registerUser, (err) => {
    if(err){
    return next(err);}
    else{
     req.flash("sucess" , "sucessesfully signed up");
     res.redirect("/listings");
    }
  });
    }
 catch(err){
    req.flash("error" , err.message);
    res.redirect("/signup");
 }
}


module.exports.renderLoginForm = (req,res) => {
    res.render("./users/login.ejs");
}
module.exports.login = (req,res) => {
    //If user was going to /listings/123/edit, 
    // use that after login; else go to /listings.
    let redirectUrl = res.locals.redirect || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout =(req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/listings");
  });
}