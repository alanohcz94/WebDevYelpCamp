const ErrorHandler = require('../utils/error');
const { joiCampgroundSchema, joiReviewSchema } = require('../validatorSchema');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.isLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()){
        // keeping track the url that the user was previously in before redirecting them to login
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You have to sign in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatorHelperCampground = (req,res,next) => {
    const { error } = joiCampgroundSchema.validate(req.body);
    if(error)
    {
        const eMsg = error.details.map(el => el.message).join(',');
        console.log(eMsg);
        throw new ErrorHandler(400, eMsg);
    }
    else
    {
        next();
    }
}

module.exports.validateHelperReview = (req,res,next) => {
    const { error } = joiReviewSchema.validate(req.body);
    if(error)
    {
        const eMsg = error.details.map(el => el.message).join(',');
        console.log(eMsg);
        throw new ErrorHandler(400, eMsg);
    }
    else
    {
        next();
    }
}

module.exports.checkAuthor = async (req,res,next) => {
    const { id } = req.params;
    const validateAuthor = await Campground.findById( id );
    if(validateAuthor && !validateAuthor.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that !');
        return res.redirect(`/campgrounds/${id}`);
    }
    
    next();
}

module.exports.checkAuthorReview = async (req,res,next) => {
    const { id , reviewId } = req.params;
    const validateAuthor = await Review.findById( reviewId );
    if(validateAuthor && !validateAuthor.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that !');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

