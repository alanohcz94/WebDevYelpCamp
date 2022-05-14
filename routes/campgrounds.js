const express = require('express');
const route = express.Router();
const HelperFunction = require('../utils/helperFunctions');
const Campground = require('../models/campground')
const { joiCampgroundSchema } = require('../validatorSchema');
const ErrorHandler = require('../utils/error');
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

route.get('/new', (req, res) =>{
    res.render('campgrounds/new');
})

route.delete('/:id', helper.asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete( id );
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))

route.put('/:id', helper.asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully update campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

route.get('/:id', helper.asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById( req.params.id ).populate('reviews');
    if(!campground)
    {
        req.flash('error', 'Cannot find campground!');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { campground })
}))

route.get('/:id/edit', helper.asyncErrorHandler(async(req, res) => {
    const campground = await Campground.findById( req.params.id );
    if(!campground)
    {
        req.flash('error', 'Cannot find campground!');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground })
}))

route.post('/', validatorHelperCampground, helper.asyncErrorHandler(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Successfully created new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

route.get('/', helper.asyncErrorHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))


module.exports = route;