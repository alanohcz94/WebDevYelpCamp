const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.getNewPage = (req, res) =>{
    res.render('campgrounds/new');
}

module.exports.getEditPage = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById( id );
    if(!campground)
    {
        req.flash('error', 'Campground not found!');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground })
} 

module.exports.getCampgroundPage = async (req, res) => {
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
}

module.exports.createCampground = async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id; //save the author to the campground
    await newCampground.save();
    req.flash('success', 'Successfully create a campground !');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground !');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const campground = await Campground.findByIdAndDelete( req.params.id );
    req.flash('success', 'Successfully delete campground !');
    res.redirect('/campgrounds');
     
}