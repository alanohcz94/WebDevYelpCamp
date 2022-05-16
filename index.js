const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground')
const Review = require('./models/review');
const mate = require('ejs-mate');
const HelperFunction = require('./utils/helperFunctions');
const ErrorHandler = require('./utils/error');
const app = express();
const helper = new HelperFunction();
const { joiCampgroundSchema , joiReviewSchema} = require('./validatorSchema');

/*
    Deprecated this 3 will always be set to true in Mongoose 6 and above
    - useNewUrlParser: true,
    - useCreateIndex: true, 
    - useUnifiedTopology:true
*/

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("Connection Ok !");
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', mate);

//app.use applies it's expression to every request
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//campgrounds route

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


app.get('/campgrounds/new',  (req, res) =>{
    res.render('campgrounds/new');
})

app.delete('/campgrounds/:id',  helper.asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete( id );
    
    res.redirect('/campgrounds');
}))

app.put('/campgrounds/:id', helper.asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id' ,helper.asyncErrorHandler(async (req, res) => {
    const campground = await Campground.findById( req.params.id ).populate('reviews');
    if(!campground)
    {
        
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', helper.asyncErrorHandler(async(req, res) => {
    const campground = await Campground.findById( req.params.id );
    if(!campground)
    {
        
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground })
}))

app.post('/campgrounds', validatorHelperCampground, helper.asyncErrorHandler(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

app.get('/campgrounds', helper.asyncErrorHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

//end of campgrounds


//review portion
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

app.post('/campgrounds/:id/reviews', validateHelperReview, helper.asyncErrorHandler(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    console.log(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/:reviewId', helper.asyncErrorHandler(async (req, res) => {
    const { id , reviewId } = req.params;
    /*
        $pull is used to pull existing array items in the specified object
    */
    const campground = await Campground.findByIdAndUpdate(id , {$pull:{reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campground._id}`);
}))

// end review portion

app.get('/', (req, res) => {
    console.log("at homepage");
    res.render('home');
})

app.all('*', (req, res, next) => {
    req.flash('error', "WRONG URL ?? OR SOMETHING !! PLEASE CHECK");
    next(new ErrorHandler(404, '404, PAGE NOT FOUND!'));
})

app.use((err, req, res, next)=> {
    const {status = 500} = err;
    if(!err.message) err.message = "Something went wrong !";
    res.status(status).render('partials/error', {err});
})


app.listen(8000, ()=>{
    console.log("APP started in port 8000")
})