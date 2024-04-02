const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required:true
    // },
    orderItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
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
