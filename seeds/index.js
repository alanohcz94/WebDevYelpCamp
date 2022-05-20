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
const price = Math.floor(Math.random() * 1000) + 10;

const seedDb = async ()=>{
    await Campground.deleteMany({}); // delete Many auto delete everything in the current db
    for(let i=0; i<10 ; i++)
    {
        const createCamp = new Campground({
            author : '62879ca05137e122ae089195',
            title: `${seedSample(descriptors)}, ${seedSample(places)}`,
            location: `${seedSample(cities).city}, ${seedSample(cities).state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Camping is an outdoor activity involving overnight stays away from home, either without shelter or using basic shelter such as a tent or a recreational vehicle. Typically participants leave developed areas to spend time outdoors in more natural ones in pursuit of activities providing them enjoyment or an educational experience. The night (or more) spent outdoors distinguishes camping from day-tripping, picnicking, and other similarly short-term recreational activities.',
            price
        });
        await createCamp.save();
    }
}


seedDb().then(()=> {
    mongoose.connection.close()
});