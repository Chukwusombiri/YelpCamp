if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const mongoose  = require('mongoose');
const CampGround = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelper');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mbxToken});

/* Mongodb Connection */
connectDb();
async function connectDb(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        console.log('Connected to database');
    } catch (error) {
        console.log('unable to connect database',error)
    }
}

const sample = (arr, ranCnt=0) => {
    return arr[Math.floor(Math.random() * (ranCnt==0 ? arr.length : ranCnt))];
}

const lorem = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos sequi corrupti aliquid reprehenderit nulla ducimus quia laboriosam quam dolore. A.'
const price = ()=>Math.floor(Math.random()*20) + 10
const seedDB = async () =>{
    try{
        await CampGround.deleteMany({});
        for(let i=0; i<300; i++){    
            random1000 = Math.floor(Math.random()*1000);        
            const c =  new CampGround({
                author: '652ffc3d2da9cf4f0630f017',
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`,                
                images: [
                    {
                      url: 'https://res.cloudinary.com/dqu0obcsg/image/upload/v1698177586/YelpCamp/hmhpby1glviywves8s6p.jpg',
                      filename: 'YelpCamp/hmhpby1glviywves8s6p',
                    },
                    {
                      url: 'https://res.cloudinary.com/dqu0obcsg/image/upload/v1698177590/YelpCamp/wnezojk9va22uhigbi5i.jpg',
                      filename: 'YelpCamp/wnezojk9va22uhigbi5i',
                    },
                    {
                      url: 'https://res.cloudinary.com/dqu0obcsg/image/upload/v1698177596/YelpCamp/xfikmxuxy72edjfyqb9w.jpg',
                      filename: 'YelpCamp/xfikmxuxy72edjfyqb9w',
                    }
                  ],
                description: lorem,
                price: price(),
                geometry : {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude,
                    ]
                },
            });                            
            await c.save();
        }
    }catch(error){
        console.log('something went wrong',error)
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
    console.log('closed connection');
});