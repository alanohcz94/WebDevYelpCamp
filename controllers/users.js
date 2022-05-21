const User = require('../models/user');
const flash = require('connect-flash');

module.exports.registerPage = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async(req, res) => {
    try{
        const { email , username , password} = req.body;
        const user = new User({email, username});
        const newUser = await User.register(user, password);
        req.login(newUser, err => {     //passport login user after registering user
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back to YelpCamp');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logout');
    res.redirect('/campgrounds');
}


module.exports.loginPage = (req, res) => {
    res.render('users/login');
}
