const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGoeCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGoeCoding({accessToken: mbxToken})

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
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));  // implesit return save the images from the file that was stored in cloudinary a
    newCampground.author = req.user._id; //save the author to the campground
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully create a campground !');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.image.push(...imgs);
    if(req.body .deleteImages){
        // $pull is used to pull a data out from the DB and then do a search on image with the filename
        // $in is used to get the data *in* request.body.deleteImages
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {image: {filename: {$in : req.body.deleteImages}}}});
        console.log(campground);
    }
    await campground.save();
    req.flash('success', 'Successfully updated campground !');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const campground = await Campground.findByIdAndDelete( req.params.id );
    req.flash('success', 'Successfully delete campground !');
    res.redirect('/campgrounds');
     
}