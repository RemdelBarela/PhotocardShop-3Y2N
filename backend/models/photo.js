const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: [{
        type: String,
    }],
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

photoSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

photoSchema.set('toJSON', {
    virtuals: true,
});


exports.Photo = mongoose.model('Photo', photoSchema);
