const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//make schema
const CampgroundSchema = new Schema({
    title: String,
    image: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author:
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
});

module.exports = mongoose.model('Campground', CampgroundSchema);