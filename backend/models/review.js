const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default:0
    },
    image: [{
        type: String
    }],
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

reviewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

reviewSchema.set('toJSON', {
    virtuals: true,
});


exports.Review = mongoose.model('Review', reviewSchema);
