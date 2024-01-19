if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const path  = require('path');
const mongoose  = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const authRoutes = require('./routes/users');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL;

/* Mongodb Connection */
async function connectDb(){
    try {
        await mongoose.connect(/* 'mongodb://127.0.0.1:27017/yelp-camp' */dbUrl)
        console.log('Connected to database');
    } catch (error) {
        console.log('unable to connect database',error)
    }
}
connectDb();

/* app setting */
app.set('view engine','ejs');
app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
const staticFilesPath = path.join(__dirname, 'public');
app.use(express.static(staticFilesPath));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on('error',function(e){
    console.log('SESSION STORE ERROR',e);
});

const sessionConfig = {
    store,
    name: 'user_session',
    secret: 'thisismyappsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        /* secure: true, */
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqu0obcsg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/* middlewares */
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');    
    next();
});


/* routes */
app.get('/',(req,res)=>res.render('home'));
app.use('/', authRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
/* app.get('/fake_user',async (req,res)=>{
    const user =  new User({
        username: 'test',
        email: 'test@mail.com',
    });

    const newUser = await User.register(user,'testpwd');
    res.send(newUser);
}) */


/* 404 handler */
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404));
})
/* error handler*/
app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message = 'Oh no! Something went terribly wrong!'
    res.status(statusCode).render('error',{err});
})


/* App port pipeline */
app.listen(3000,()=>console.log('Serving on port 3000'));