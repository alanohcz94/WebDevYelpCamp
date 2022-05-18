const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const campground = require('./routes/campground')
const review = require('./routes/review');
const mate = require('ejs-mate');
const ErrorHandler = require('./utils/error');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'password',
    resave:false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next) => {
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds' , campground);
app.use('/campgrounds/:id/reviews', review);

app.get('/', (req, res) => {
    console.log("at homepage");
    res.render('home');
})

app.all('*', (req, res, next) => {
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