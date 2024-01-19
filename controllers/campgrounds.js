const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mbxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find();    
    res.render('campgrounds/index',{campgrounds});
}

module.exports.create = (req,res)=>{   
    res.render('campgrounds/new');
}

module.exports.show = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if(!campground){
        req.flash('error','whoops!! Cannot find campground');
        return res.redirect('/campgrounds');
    } 
    res.render('campgrounds/show',{campground});
}

module.exports.store = async(req,res)=>{        
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();     
    const {campground} = req.body;
    const camp = new Campground(campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.author = req.user._id;
    camp.images = req.files.map(fil=>({url: fil.path, filename: fil.filename}));
    await camp.save();
    console.log(camp);
    req.flash('success','Successful!! new campground was added');
    return res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.edit = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.update = async(req,res)=>{    
    const {id} = req.params;      
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground);
    if(req.files.length>0){
        for(let f of req.files){
            camp.images.push({url: f.path, filename: f.filename});
        }
        await camp.save();
    }
    
    if(req.body.deleteImages){
        for(let photo of req.body.deleteImages){
            await cloudinary.uploader.destroy(photo);
        }
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }        
    req.flash('success','Successful!! Campground was updated')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.destroy = async(req,res,next)=>{
    try{
     await Campground.findByIdAndDelete(req.params.id);  
     req.flash('success','Successful!! Camground was deleted')  
     res.redirect(`/campgrounds`);
    }catch(error){     
      console.log(error);
      next(error);
    }
 }
