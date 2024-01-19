const express =  require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const userController = require('../controllers/users');

/* middlewares */
const { storeReturnTo } = require('../middleware');


/* routes */
router.route('/register')
    .get(userController.create)
    .post(userController.store);

router.route('/login')
    .get(userController.login)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), userController.redirectUser);

router.get('/logout',userController.logout);

module.exports = router;