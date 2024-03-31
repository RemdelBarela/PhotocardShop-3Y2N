const express = require('express');
const { Review } = require('../models/review');
const { OrderItem } = require('../models/order-item');

const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) =>{
    
    console.log(req.query)
       
    const reviewList = await Review.find();

    if(!reviewList) {
        res.status(500).json({success: false})
    } 
    res.send(reviewList);
})

router.get(`/select/:id`, async (req, res) =>{
    const review = await Review.findById(req.params.id);

    if(!review) {
        res.status(500).json({success: false})
    } 
    res.send(review);
})

router.post(`/new/:id`, async (req, res) => {
    const orderId = req.params.id;

    console.log('req: ', req.body)
    try {
        const orderItem = await OrderItem.findById(orderId);
        if (!orderItem) {
            return res.status(404).json({ success: false, message: "Order item not found" });
        }

        const newReview = new Review({
            orderItem: orderId,
            comment: req.body.comment,
            rating: req.body.rating
        });

        console.log('newReview: ', newReview)

        const savedReview = await newReview.save();
        res.status(201).send(savedReview);
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


router.put('/:id', async (req, res) => {
    console.log(req.body);
    
    const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        {
            review: req.body.review,
            rating: req.body.rating,
        },
        { new: true }
    );

    if (!updatedReview) return res.status(500).send('THE REVIEW CANNOT BE UPDATED!');

    res.send(updatedReview);
});

router.delete('/:id', (req, res)=>{
    Review.findByIdAndRemove(req.params.id).then(review =>{
        if(review) {
            return res.status(200).json({success: true, message: 'THE REVIEW IS DELETED!'})
        } else {
            return res.status(404).json({success: false , message: "REVIEW NOT FOUND!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/order-item/:id`, async (req, res) => {
    const orderItem = await OrderItem.findById(req.params.id)
        .populate({
            path: 'photocard', 
            populate: {
                    path: 'photo',
                    model: 'Photo'
                }
        })
        .populate({
            path: 'photocard', 
            populate: {
                    path: 'material',
                    model: 'Material'
                }
        })

    if (!orderItem) {
        res.status(500).json({ success: false })
    }
    res.send(orderItem);
})

// router.get(`/order-item/:id`, async (req, res) => {
//     try {
//         const orderItem = await OrderItem.findById(req.params.id)
//             .populate({
//                 path: 'photocard', 
//                 populate: {
//                     path: 'photo',
//                     model: 'Photo'
//                 }
//             })
//             .populate({
//                 path: 'photocard', 
//                 populate: {
//                     path: 'material',
//                     model: 'Material'
//                 }
//             });

//         if (!orderItem) {
//             return res.status(404).json({ success: false, message: 'Order Item not found' });
//         }

//         // Check if the orderItem_id exists in the Review model
//         const existingReview = await Review.findOne({ orderItem: orderItem._id });

//         res.status(200).json({ success: true, orderItem, hasReview: !!existingReview });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });


module.exports=router;