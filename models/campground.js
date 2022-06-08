const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//make virtual schema
const ImageSchema = new Schema ({
    url:String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const virtualOptions = { toJSON: { virtuals: true} };

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
}, virtualOptions);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>\n<p>${this.description.substring(0, 20)}</p>`;
})


module.exports = mongoose.model('Campground', CampgroundSchema);