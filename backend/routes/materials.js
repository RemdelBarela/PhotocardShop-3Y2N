const express = require('express');
const { Material } = require('../models/material');
// const { Category } = require('../models/category');
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
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    // localhost:3000/api/v1/products?categories=2342342,234234
    console.log(req.query)
    let filter = {};
    const materialList = await Material.find(filter);
    // if(req.query.categories)
    // {
    //      filter = {category: req.query.categories.split(',')}
    // }

    // const materialList = await Material.find(filter).populate('category');

    // console.log(materialList.category)

    if(!materialList) {
        res.status(500).json({success: false})
    } 
    res.send(materialList);
})

router.get(`/:id`, async (req, res) =>{
    // const material = await Material.findById(req.params.id).populate('category');
    const material = await Material.findById(req.params.id);

    if(!material) {
        res.status(500).json({success: false})
    } 
    res.send(material);
})

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    // const category = await Category.findById(req.body.category);
    // if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let material = new Material({
        name: req.body.name,
        // description: req.body.description,
        // richDescription: req.body.richDescription,
        price: req.body.price,
        image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
        // brand: req.body.brand,
        // category: req.body.category,
        countInStock: req.body.countInStock,
        // rating: req.body.rating,
        // numReviews: req.body.numReviews,
        // isFeatured: req.body.isFeatured
    });

    material = await material.save();

    if (!material) return res.status(500).send('The material cannot be created');

    res.send(material);
});


router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    console.log(req.body);
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Material Id');
    }
    // const category = await Category.findById(req.body.category);
    // if (!category) return res.status(400).send('Invalid Category');

    const material = await Material.findById(req.params.id);
    if (!material) return res.status(400).send('Invalid Material!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = material.image;
    }

    const updatedMaterial = await Material.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            // description: req.body.description,
            // richDescription: req.body.richDescription,
            price: req.body.price,
            image: imagepath,
            // brand: req.body.brand,
            // category: req.body.category,
            countInStock: req.body.countInStock,
            // rating: req.body.rating,
            // numReviews: req.body.numReviews,
            // isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!updatedMaterial) return res.status(500).send('the material cannot be updated!');

    res.send(updatedMaterial);
});

router.delete('/:id', (req, res)=>{
    Material.findByIdAndRemove(req.params.id).then(material =>{
        if(material) {
            return res.status(200).json({success: true, message: 'the material is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "material not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const materialCount = await Material.countDocuments((count) => count)

    if(!materialCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        materialCount: materialCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const materials = await Material.find({isFeatured: true}).limit(+count);

    if(!materials) {
        res.status(500).json({success: false})
    } 
    res.send(materials);
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Material Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const material = await Material.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );
        
    if (!material) return res.status(500).send('the gallery cannot be updated!');

    res.send(material);
});

module.exports=router;