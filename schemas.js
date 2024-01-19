const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const Joi = BaseJoi.extend((joi)=>{
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include HTML!'
        },
        rules: {
            escapeHTML: {
                validate(value,helpers){
                    const clean = sanitizeHtml(value,{
                        allowedTags:[],
                        allowedAttributes:{},
                    });
                    // Check if the result is an array and join it
                    const cleanedValue = Array.isArray(clean) ? clean.join('') : clean;

                    if (cleanedValue !== value) {
                        return helpers.error('string.escapeHTML', { value });
                    }

                    return cleanedValue;
                }
            }
        }
    }
});

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        images: Joi.array().items(Joi.string()),
    }).required(),
    deleteImages: Joi.array().items(Joi.string()),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().min(0).escapeHTML(),        
    }).required(),
})