const express = require('express');
const { Review } = require('../models/review');
const { OrderItem } = require('../models/order-item');
const { Order } = require('../models/order');


const router = express.Router();
const mongoose = require('mongoose');

// router.get(`/`, async (req, res) =>{
           
//     const reviewList = await Review.find()
//     .populate({
//         path: 'orderItem', 
//         populate: {
//             path: 'photocard',
//             populate: {
//                 path: 'photo',
//                 model: 'Photo'
//             }
//         }
//     })

//     const orderItemIds = reviewList.map(review => review.orderItem);
    
//     console.log(orderItemIds)
//     const orders = await Order.find({ _id: { $in: orderItemIds } });

//     if(!reviewList) {
//         res.status(500).json({success: false})
//     } 
//     res.send(orders);
// })

// router.get(`/`, async (req, res) => {
//     try {
//         // Fetch all Review documents with populated orderItem
//         const reviewList = await Review.find()
//             .populate({
//                 path: 'orderItem',
//                 populate: {
//                     path: 'photocard',
//                     populate: {
//                         path: 'photo',
//                         model: 'Photo'
//                     }
//                 }
//             });

//         // Extract all orderItem IDs from reviewList
//         const orderItemIds = reviewList.reduce((acc, review) => {
//             if (Array.isArray(review.orderItem)) {
//                 acc.push(...review.orderItem.map(item => item._id));
//             } else {
//                 acc.push(review.orderItem._id);
//             }
//             return acc;
//         }, []);

//         console.log(orderItemIds)

//         // Find Orders where at least one orderItem._id matches the orderItemIds
//         const orders = await Order.find({ 'orderItems._id': { $in: orderItemIds } });

//         res.status(200).json({ success: true, data: orders });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).json({ success: false, error: "Internal server error" });
//     }
// });


// router.get(`/`, async (req, res) => {
//     try {
//         // Fetch all Review documents
//         const reviewList = await Review.find()

//         const orderItemIds = reviewList.flatMap(review => review.orderItem);

//         const orders = await Order.find({ 'orderItems': { $in: orderItemIds } });

//         res.status(200).json({ success: true, data: orders });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).json({ success: false, error: "Internal server error" });
//     }
// });

router.get(`/`, async (req, res) => {
    try {
        // Fetch all Review documents
        const reviewList = await Review.find();

        // Extract unique order item IDs from reviewList
        const orderItemIds = [...new Set(reviewList.flatMap(review => review.orderItem))];

        // Aggregate to find orders containing any of the extracted orderItemIds
        const orders = await Order.aggregate([
            {
                $match: {
                    "orderItems": { $in: orderItemIds }
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "orderItems",
                    foreignField: "orderItem",
                    as: "reviews"
                }
            }
        ]);

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});




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