const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.store = async(req,res,next)=>{
    try {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        await review.save();
        campground.reviews.push(review);
        campground.save();
        req.flash('success','Successful!! Review was added for this Campground')
        res.redirect(`/campgrounds/${campground._id}`);        
    } catch (error) {
        next(error);
    }
}

module.exports.destroy = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successful!! Review was deleted')
    res.redirect(`/campgrounds/${id}`); 
}