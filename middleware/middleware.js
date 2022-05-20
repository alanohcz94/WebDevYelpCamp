module.exports.isLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()){
        // keeping track the url that the user was previously in before redirecting them to login
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You have to sign in');
        return res.redirect('/login');
    }
    next();
}