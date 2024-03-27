const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    photocard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photocard'
    }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);

