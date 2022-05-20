const express = require('express');
const route = express.Router();
const User = require('../models/user');
const flash = require('connect-flash');
const HelperFunction = require('../utils/helperFunctions');
const passport = require('passport');

const helper = new HelperFunction();

//register
route.get('/register', (req, res) => {
    res.render('users/register');
});

route.post('/register', helper.asyncErrorHandler(async(req, res) => {
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
}));

//login
route.get('/login', (req, res) => {
    res.render('users/login');
});

route.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back to YelpCamp');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

//logout
route.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logout');
    res.redirect('/campgrounds');
});



module.exports = route;