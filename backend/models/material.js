const mongoose = require('mongoose');

const materialSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        default:0
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 500
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

materialSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

materialSchema.set('toJSON', {
    virtuals: true,
});

exports.Material = mongoose.model('Material', materialSchema);