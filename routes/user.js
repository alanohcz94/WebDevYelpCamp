const express = require('express');
const route = express.Router();
const users = require('../controllers/users');
const HelperFunction = require('../utils/helperFunctions');
const passport = require('passport');

const helper = new HelperFunction();

// Routes
route.route('/register')
    .get(users.registerPage)
    .post( helper.asyncErrorHandler(users.registerUser));


route.route('/login')
    .get(users.loginPage)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

route.get('/logout', users.logoutUser);


module.exports = route;