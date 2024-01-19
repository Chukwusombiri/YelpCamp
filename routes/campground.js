const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

/* middleware */
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');

/* routes */
router.route('/')
    .get(campgroundController.index)
    .post(isLoggedIn, upload.array('images'), validateCampground, 
    campgroundController.store);

router.get('/new', isLoggedIn, campgroundController.create);

router.route('/:id')
    .get(campgroundController.show)
    .patch(isLoggedIn, isAuthor, upload.array('images'), validateCampground, campgroundController.update)
    .delete(isLoggedIn, isAuthor, campgroundController.destroy);

router.get('/:id/edit', isLoggedIn, isAuthor, campgroundController.edit);

module.exports = router;