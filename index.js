const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground')
const mate = require('ejs-mate');

const app = express();

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


app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete( id );
    // const campground = await Campground.findByIdAndRemove( id,  );
    res.redirect('/campgrounds');
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate( id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id/edit', async(req, res) => {
    const campground = await Campground.findById( req.params.id );
    res.render('campgrounds/edit', { campground })
})

app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
})

app.get('/', (req, res) => {
    console.log("at homepage");
    res.render('home');
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById( req.params.id );
    res.render('campgrounds/show', { campground })
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})


app.listen(8000, ()=>{
    console.log("APP started in port 8000")
})