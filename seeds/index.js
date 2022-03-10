const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

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

const seedSample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async ()=>{
    await Campground.deleteMany({}); // delete Many auto delete everything in the current db
    for(let i=0; i<50 ; i++)
    {
        const createCamp = new Campground({
            title: `${seedSample(descriptors)}, ${seedSample(places)}`,
            location: `${seedSample(cities).city}, ${seedSample(cities).state}`
        });
        await createCamp.save();
    }
}


seedDb().then(()=> {
    mongoose.connection.close()
});