const express = require('express');
const route = express.Router({ mergeParams: true }); 
const Review = require('../models/review');
const Campground = require('../models/campground');
const HelperFunction = require('../utils/helperFunctions');
const flash = require('connect-flash');
const { isLoggedIn, checkAuthorReview , validateHelperReview  } = require('../middleware/middleware');

const helper = new HelperFunction();

route.post('/', validateHelperReview, isLoggedIn, helper.asyncErrorHandler(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully commented');
    res.redirect(`/campgrounds/${campground._id}`);
}))

route.delete('/:reviewId', isLoggedIn, checkAuthorReview, helper.asyncErrorHandler(async (req, res) => {
    const { id , reviewId } = req.params;
    /*
        $pull is used to pull existing array items in the specified object
    */
    const campground = await Campground.findByIdAndUpdate(id , {$pull:{reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted comment');
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = route;