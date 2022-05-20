const express = require('express');
const route = express.Router();
const Campground = require('../models/campground');
const HelperFunction = require('../utils/helperFunctions');
const ErrorHandler = require('../utils/error');
const { joiCampgroundSchema } = require('../validatorSchema');
const { isLoggedIn } = require('../middleware/middleware');

const helper = new HelperFunction();

const validatorHelperCampground = (req,res,next) => {
    const { error } = joiCampgroundSchema.validate(req.body);
    if(error)
    {
        const eMsg = error.details.map(el => el.message).join(',');
        // console.log(eMsg);
        throw new ErrorHandler(400, eMsg);
    }
    else
    {
        next();
    }
}

const validateAuthor = 

route.get('/new', isLoggedIn,  (req, res) =>{
    res.render('campgrounds/new');
})

route.delete('/:id', isLoggedIn , helper.asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const validateAuthor = await Campground.findById( id );
    if(req.user._id && validateAuthor.author.equals(req.user._id)) {
        const campground = await Campground.findByIdAndDelete( id );
        req.flash('success', 'Successfully delete campground !');
        res.redirect('/campgrounds');
    }
    else {
        req.flash('error', 'You do not have permission to do that !');
        res.redirect(`/campgrounds/${id}`);
    }   
}))

route.put('/:id', isLoggedIn ,helper.asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const validateAuthor = await Campground.findById( id );
    if(req.user._id && validateAuthor.author.equals(req.user._id)) {
        const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
        req.flash('success', 'Successfully updated campground !');
        res.redirect(`/campgrounds/${campground._id}`);
    }
    else {
        req.flash('error', 'You do not have permission to do that !');
        res.redirect(`/campgrounds/${id}`);
    }
}))

route.get('/:id' , helper.asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById( req.params.id ).populate('reviews').populate('author');
    if(!campground)
    {
        req.flash('error', 'Campground not found!');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { campground })
}))

route.get('/:id/edit', isLoggedIn, helper.asyncErrorHandler(async(req, res) => {
    const { id } = req.params;
    const validateAuthor = await Campground.findById( id );
    if(req.user._id && validateAuthor.author.equals(req.user._id)) {
        const campground = await Campground.findById( id );
        if(!campground)
        {
            req.flash('error', 'Campground not found!');
            return res.redirect(`/campgrounds`);
        }
        res.render('campgrounds/edit', { campground })
    }
    else {
        req.flash('error', 'You do not have permission to do that !');
        res.redirect(`/campgrounds/${id}`);
    }
}))

route.post('/', isLoggedIn, validatorHelperCampground, helper.asyncErrorHandler(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id; //save the author to the campground
    await newCampground.save();
    req.flash('success', 'Successfully create a campground !');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

route.get('/', helper.asyncErrorHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))


module.exports = route;