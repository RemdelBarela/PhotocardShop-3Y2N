const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    orderItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderItem',
        required:true
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
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
