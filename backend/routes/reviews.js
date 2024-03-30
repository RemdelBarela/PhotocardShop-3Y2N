const express = require('express');
const { Review } = require('../models/review');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads/reviews');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage }).array('image', 10); // Update to handle multiple files

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

router.post(`/new`, async (req, res) => {
    console.log(req.body)

    // uploadOptions(req, res, async (err) => {
    //     if (err) {
    //         return res.status(500).json({success: false, error: err})
    //     } else {
    //         const files = req.files;
    //         if (!files || files.length === 0) {
    //             return res.status(400).send('NO IMAGES IN THE REQUEST');
    //         }

    //         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/reviews/`;
    //         let reviewPaths = [];
    //         files.forEach(file => {
    //             const fileName = file.filename;
    //             reviewPaths.push(`${basePath}${fileName}`);
    //         });

            const newReview = new Review({
                comment: req.body.comment,
                rating: req.body.rating,
                // image: reviewPaths
            });

            console.log(newReview)
            try {
                const savedReview = await newReview.save();
                res.status(201).send(savedReview);
            } catch (error) {
                return res.status(500).json({success: false})
            }
        }
    // }
    // );
);

router.put('/:id', uploadOptions, async (req, res) => {
    console.log(req.body);
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('INVALID REVIEW ID');
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(400).send('INVALID REVIEW!');

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/reviews/`;
        req.files.forEach(file => {
            const fileName = file.filename;
            const imagePath = `${basePath}${fileName}`;
            imagePaths.push(imagePath);
        });
    } else {
        // If no files are uploaded, use the existing image paths
        imagePaths = review.image;
    }

    const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        {
            review: req.body.review,
            rating: req.body.rating,
            image: imagePaths,
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

router.get(`/get/count`, async (req, res) =>{
    const reviewCount = await Review.countDocuments((count) => count)

    if(!reviewCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        reviewCount: reviewCount
    });
})

module.exports=router;