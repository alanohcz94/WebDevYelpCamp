const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//make schema
const ImageSchema = new Schema ({
    url:String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    image: [ImageSchema],
    geometry: {
        type:{
            type:String,
            enum:['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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