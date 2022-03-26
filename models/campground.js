const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review'); 

//make schema
const CampgroundSchema = new Schema({
    title: String,
    image:String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(campground){
    console.log(campground);
    if(campground){
        await Review.remove({
            _id: {
                $in: campground.reviews,
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);