const express = require('express');
const route = express.Router();
const Campground = require('../models/campground');
const HelperFunction = require('../utils/helperFunctions');
const { isLoggedIn, checkAuthor, validatorHelperCampground } = require('../middleware/middleware');
const helper = new HelperFunction();

route.get('/new', isLoggedIn,  (req, res) =>{
    res.render('campgrounds/new');
})

route.delete('/:id', isLoggedIn , checkAuthor ,helper.asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findByIdAndDelete( req.params.id );
    req.flash('success', 'Successfully delete campground !');
    res.redirect('/campgrounds');
     
}))

route.put('/:id', isLoggedIn, checkAuthor ,helper.asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground !');
    res.redirect(`/campgrounds/${campground._id}`);
}))

route.get('/:id' , helper.asyncErrorHandler(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById( id )
        .populate({
            path:'reviews',
            populate: {
                path:'author'
            }
        }).populate('author');
    if(!campground)
    {
        req.flash('error', 'Campground not found!');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { campground })
}))

route.get('/:id/edit', isLoggedIn, checkAuthor, helper.asyncErrorHandler(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById( id );
    if(!campground)
    {
        req.flash('error', 'Campground not found!');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground })
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