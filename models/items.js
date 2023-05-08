const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required:true
    },
    category : {
        type: String,
        required: true
    },
    ageRequirement: {
        type: Number,
        required: true,
        default: 0
    },
    quantity : {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Item', itemSchema);