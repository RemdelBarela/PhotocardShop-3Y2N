const mongoose = require('mongoose');

const photocardSchema = mongoose.Schema({
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
    },
})

photocardSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

photocardSchema.set('toJSON', {
    virtuals: true,
});

exports.Photocard = mongoose.model('Photocard', photocardSchema);

