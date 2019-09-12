const mongoose = require('mongoose');
let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true,
            uppercase:true
        },
        lastName: String
    },
    level: {
        type: String,
        required:true,
        uppercase:true,
        enum: ['BEGINNER','EXPERT']
    },
    address: { 
        state: String,
        suburb: String,
        street:String,
        unit:Number
    }
});
module.exports = mongoose.model('Developer', developerSchema);