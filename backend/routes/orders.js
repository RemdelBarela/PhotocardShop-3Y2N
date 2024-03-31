const { Photocard } = require('../models/photocard');
const { Photo } = require('../models/photo');
const { Material } = require('../models/material');
const { Order } = require('../models/order');
const { User } = require('../models/user');
const { Review } = require('../models/review');

const nodemailer = require('nodemailer');

const sendTransactionEmail = require('../utils/sendTransactionEmail');

const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();


router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });

    if (!orderList) {
        res.status(500).json({ success: false })
    }
   
    res.status(201).json(orderList)
})

// router.get(`/:id`, async (req, res) => {
//     const order = await Order.findById(req.params.id)
//         .populate('user', 'name')
//         .populate({
//             path: 'orderItems', 
//             populate: {
//                 path: 'product', 
//                 populate: 'category'
//             }
//         });

//     if (!order) {
//         res.status(500).json({ success: false })
//     }
//     res.send(order);
// })
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user')
            .populate({
                path: 'orderItems', 
                populate: {
                    path: 'photocard',
                    populate: {
                        path: 'photo',
                        model: 'Photo'
                    }
                }
            })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'photocard',
                    populate: {
                        path: 'material',
                        model: 'Material'
                    }
                }
            });

        console.log(order)

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const orderItems = order.orderItems;

        // Check if a review exists for any of the order items
        const hasReviews = await Promise.all(orderItems.map(async (orderItem) => {
            const existingReview = await Review.findOne({ orderItem: orderItem._id });
            return !!existingReview;
        }));

        res.status(200).json({ success: true, order, hasReviews });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/:photo_id/:material_id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photo_id);
        const material = await Material.findById(req.params.material_id);

        // Check if photo and material exist
        if (!photo) {
            return res.status(404).json({ success: false, error: 'PHOTO NOT FOUND' });
        }

        if (!material) {
            return res.status(404).json({ success: false, error: 'MATERIAL NOT FOUND' });
        }

       const photocard = await Photocard.create({
                photo: req.params.photo_id,
                material: req.params.material_id,
            });

            return res.status(201).json({
                success: true,
                photocard
            });
   
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'FAILED TO CREATE PHOTOCARD',
            error: error.message // You might want to provide more details about the error
        });
    }
})

router.get(`/photocard/:id`, async (req, res) => {
    const photocard = await Photocard.findById(req.params.id)
    .populate('photo')
    .populate( 'material')
    
    if (!photocard) {
        res.status(500).json({ success: false })
    }
    res.send(photocard);
})

// router.post('/', async (req, res) => {
//     try {
//         const orderItemsPromises = req.body.orderItems.map(async (orderItem) => {
//             let newOrderItem = new OrderItem({
//                 quantity: orderItem.quantity,
//                 photocard: orderItem.newData._id
//             });

//             newOrderItem = await newOrderItem.save();

//             console.log(newOrderItem);
//             return newOrderItem._id; // Return the ID of the newly created OrderItem
//         });

//         const orderItemsIds = await Promise.all(orderItemsPromises); // Wait for all promises to resolve

//         console.log(orderItemsIds);

//         const orderItems = await OrderItem.find({_id: {$in: orderItemsIds}}).populate({
//             path: 'photocard',
//             populate: {
//                 path: 'material',
//                 model: 'Material'
//             }
//         });

//         let totalPrice = 0;

//         for (const orderItem of orderItems) {
//             const photocard = orderItem.photocard;
//             const material = photocard.material;
//             const itemPrice = material.price * orderItem.quantity;

//             // Update total price
//             totalPrice += itemPrice;

//             // Update material countInStock
//             const updatedCountInStock = material.countInStock - orderItem.quantity;
//             material.countInStock = updatedCountInStock;
//             await material.save();

//             console.log(`Material ${material.name}: Count in stock updated to ${updatedCountInStock}`);
//         }

//         let order = new Order({
//             orderItems: orderItemsIds,
//             shippingAddress1: req.body.shippingAddress1,
//             shippingAddress2: req.body.shippingAddress2,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             phone: req.body.phone,
//             : 'Pending',
//             totalPrice: totalPrice,
//             user: req.body.user
//         });

//         order = await order.save();

//         if (!order)
//             return res.status(400).send('The order cannot be created!');

//         res.send(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }    
// });


// router.post('/', async (req, res) => {
//     try {
//         const orderItemsPromises = req.body.orderItems.map(async (orderItem) => {
//             let newOrderItem = new OrderItem({
//                 quantity: orderItem.quantity,
//                 photocard: orderItem.newData._id
//             });

//             newOrderItem = await newOrderItem.save();

//             console.log(newOrderItem);
//             return newOrderItem._id; // Return the ID of the newly created OrderItem
//         });

//         const orderItemsIds = await Promise.all(orderItemsPromises); // Wait for all promises to resolve

//         console.log(orderItemsIds);

//         const orderItems = await OrderItem.find({_id: {$in: orderItemsIds}}).populate({
//             path: 'photocard',
//             populate: {
//                 path: 'material',
//                 model: 'Material'
//             }
//         });

//         let totalPrice = 0;
//         let totalQuantity = 0;

//         orderItems.forEach(orderItem => {
//             const photocard = orderItem.photocard;
//             const material = photocard.material;
//             const itemPrice = material.price * orderItem.quantity;
//             const itemQuantity = orderItem.quantity;

//             console.log(photocard);
//             console.log(material);
//             console.log(itemPrice);
//             console.log(itemQuantity);

//             // Update total price and quantity
//             totalPrice += itemPrice;
//             totalQuantity += itemQuantity;

//             // Output or further processing based on photocard and material details
//             console.log(`Photocard Material: ${material.name}, Price: ${itemPrice}, Quantity: ${itemQuantity}`);
//         });

//         let order = new Order({
//             orderItems: orderItemsIds,
//             shippingAddress1: req.body.shippingAddress1,
//             shippingAddress2: req.body.shippingAddress2,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             phone: req.body.phone,
//             status: 'Pending',
//             totalPrice: totalPrice,
//             user: req.body.user
//         });

//         order = await order.save();

//         if (!order)
//             return res.status(400).send('The order cannot be created!');

//         res.send(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }    
// });

// router.post('/', async (req, res) => {
//     try {
//         const orderItemsPromises = req.body.orderItems.map(async (orderItem) => {
//             let newOrderItem = new OrderItem({
//                 quantity: orderItem.quantity,
//                 photocard: orderItem.newData._id
//             });

//             newOrderItem = await newOrderItem.save();
//             return newOrderItem._id; // Return the ID of the newly created OrderItem
//         });

//         const orderItemsIds = await Promise.all(orderItemsPromises);

//         const orderItems = await OrderItem.find({_id: {$in: orderItemsIds}}).populate({
//             path: 'photocard',
//             populate: {
//                 path: 'material',
//                 model: 'Material'
//             },

//         });

//         let totalPrice = 0;

//         for (const orderItem of orderItems) {
//             const photocard = orderItem.photocard;
//             const material = photocard.material;
//             const itemPrice = material.price * orderItem.quantity;

//             // Update total price
//             totalPrice += itemPrice;

//             // Update material countInStock
//             const updatedCountInStock = material.countInStock - orderItem.quantity;
//             material.countInStock = updatedCountInStock;
//             await material.save();

//             console.log(`Material ${material.name}: Count in stock updated to ${updatedCountInStock}`);
//         }

//         let order = new Order({
//             orderItems: orderItemsIds,
//             shippingAddress1: req.body.shippingAddress1,
//             shippingAddress2: req.body.shippingAddress2,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             phone: req.body.phone,
//             status: 'Pending',
//             totalPrice: totalPrice,
//             user: req.body.user
//         });

//         order = await order.save();

//         if (!order)
//             return res.status(400).send('The order cannot be created!');

//         // Send email to user
//         const user = await User.findById(req.body.user);
//         if (user) {
//             // Prepare order details for the email
//             const orderDetails = orderItems.map(orderItem => ({
//                 productName: orderItem.photocard.material.name,
//                 quantity: orderItem.quantity,
//                 price: orderItem.photocard.material.price
//             }));

//             // Send order confirmation email to the user
//             await sendTransactionEmail({
//                 email: user.email,
//                 subject: 'Order Confirmation',
//                 orderDetails: orderDetails
//             });
//         }

//         res.send(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

router.post('/', async (req, res) => {
    try {
        const orderItemsPromises = req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                photocard: orderItem.newData._id
            });

            newOrderItem = await newOrderItem.save();
            return newOrderItem._id; // Return the ID of the newly created OrderItem
        });

        const orderItemsIds = await Promise.all(orderItemsPromises);

        // Populate related models while fetching order items
        const orderItems = await OrderItem.find({_id: {$in: orderItemsIds}}).populate({
            path: 'photocard',
            populate: {
                path: 'material',
                model: 'Material'
            }
        });

        let totalPrice = 0;

        for (const orderItem of orderItems) {
            const photocard = orderItem.photocard;
            const material = photocard.material;
            const itemPrice = material.price * orderItem.quantity;

            // Update total price
            totalPrice += itemPrice;

            // Update material countInStock
            const updatedCountInStock = material.countInStock - orderItem.quantity;
            material.countInStock = updatedCountInStock;
            await material.save();

            console.log(`Material ${material.name}: Count in stock updated to ${updatedCountInStock}`);
        }

        let order = new Order({
            orderItems: orderItemsIds,
            street: req.body.street,
            barangay: req.body.barangay,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: 'Pending',
            totalPrice: totalPrice,
            user: req.body.user
        });

        // Save the order
        order = await order.save();

        if (!order)
            return res.status(400).send('The order cannot be created!');

        // Populate related models in the saved order
       // Populate related models in the saved order
       await order.populate({
        path: 'orderItems',
        populate: [
            {
                path: 'photocard',
                populate: [
                    {
                        path: 'material',
                        model: 'Material'
                    },
                    {
                        path: 'photo',
                        model: 'Photo'
                    }
                ]
            }
        ]
    });


        // Send email to user
        const user = await User.findById(req.body.user);
        if (user) {
            // Prepare order details for the email
            const orderDetails = order.orderItems.map(orderItem => ({
                photo: orderItem.photocard.photo.name,
                material: orderItem.photocard.material.name,
                quantity: orderItem.quantity,
                price: orderItem.photocard.material.price,
            }));

            console.log(orderDetails)
            // Send order confirmation email to the user
            await sendTransactionEmail({
                email: user.email,
                name: user.name,
                orderID: order._id,
                subject: 'ORDER CONFIRMATION',
                orderDetails: orderDetails
            });
        }

        res.send(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    )

    if (!order)
        return res.status(400).send('the order cannot be update!')

    res.send(order);
})


router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({ totalsales: totalSales.pop().totalsales })
})

router.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count)

    if (!orderCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        orderCount: orderCount
    });
})

router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userid }).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }
    res.send(userOrderList);
})



module.exports = router;