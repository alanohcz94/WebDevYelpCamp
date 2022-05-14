const express = require('express');
const route = express.Router({mergeParams: true});
const { joiReviewSchema } = require('../validatorSchema');
const HelperFunction = require('../utils/helperFunctions');
const Review = require('../models/review')
const Campground = require('../models/campground');
const ErrorHandler = require('../utils/error');
const helper = new HelperFunction();

const validateHelperReview = (req,res,next) =>{
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

route.post('/', validateHelperReview, helper.asyncErrorHandler(async (req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review Added!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

route.delete('/:reviewId', helper.asyncErrorHandler(async (req, res) => {
    const { id , reviewId } = req.params;
    /*
        $pull is used to pull existing array items in the specified object
    */
    const campground = await Campground.findByIdAndUpdate(id , {$pull:{reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully delete review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))



module.exports = route;