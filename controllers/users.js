const User = require('../models/user');

module.exports.create = (req,res)=>{
    res.render('auth/register');
}

module.exports.store = async (req,res)=>{
    const {username, email, password, passwordRepeat} = req.body;
    if(password !== passwordRepeat){
        req.flash('error','Passwords must match');
        return res.redirect('/register');
    }
    try {
        const user =  new User({username, email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if (err) {
                return next(err);
            }
            req.flash('success','Welcome to Yelpcamp!!');    
            return res.redirect('/campgrounds');
        })
        /* req.session.user_id = registeredUser._id; */       
    } catch (error) {
        req.flash('error',error.message);
        return res.redirect('/register')
    }    
}

module.exports.login = (req,res)=>{
    res.render('auth/login');
}

module.exports.redirectUser = (req,res)=>{
    req.flash('success','welcome back');
    /* req.session.user_id = registeredUser._id; */
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });    
}