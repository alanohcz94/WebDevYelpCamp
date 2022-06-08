// if i am in develop use my local env file
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

 // require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const mate = require('ejs-mate');
const ErrorHandler = require('./utils/error');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const campgroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/review');
const userRoute = require('./routes/user');


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
app.use(mongoSanitize());

//app.use applies it's expression to every request
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    name: 'LetsTestMyCookieTheBloodyNameHereHelloHellow', // this gives a name to the cookie
    secret: 'password',
    resave:false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // this 'secure' keyowrd only allows https(secure connection) to have access to cookies
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //storing
passport.deserializeUser(User.deserializeUser()); //unstoring

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds' , campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);
app.use('/', userRoute);

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


app.listen(3000, ()=>{
    console.log("APP started in port 3000")
})