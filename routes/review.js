const express = require('express');
const router = express.Router({mergeParams:true});
const CampGround = require('../models/campground');
const Review = require('../models/review');
const reviewController = require('../controllers/reviews');

/* middlewares */
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');

/* reviews */
router.post('/',isLoggedIn, validateReview, reviewController.store);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.destroy)

router.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message = 'Oh no! Something went terribly wrong!'
    res.status(statusCode).render('error',{err});
});

module.exports = router;