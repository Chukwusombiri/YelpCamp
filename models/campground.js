const mongoose = require('mongoose');
const Review = require('./review');
const {Schema} = mongoose;

const imageSchema = new Schema({
    url: String,
    filename: String,
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})
const campgroundSchema = new Schema({
    title: {
        type: String,
    },
    images: [imageSchema],
    price: {
        type: Number,
    },
    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required:true,
        }
    },
    location: {
        type: String,
    },
    description: {
        type: String,
    },
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]    
},{toJSON: {virtuals: true}});

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})

campgroundSchema.post('findOneAndDelete',async (campground)=>{
    if(campground){
        await Review.deleteMany({
            _id:{
                $in: campground.reviews
            }
        })
    }
})

const CampGround = mongoose.model('CampGround', campgroundSchema);

module.exports = CampGround;