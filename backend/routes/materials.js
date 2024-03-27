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

const uploadOptions = multer({ storage: storage }).array('image', 10); // Update to handle multiple files

router.get(`/`, async (req, res) =>{
    console.log(req.query)

    const materialList = await Material.find();

    if(!materialList) {
        res.status(500).json({success: false})
    } 
    res.send(materialList);
})

router.get(`/select/:id`, async (req, res) =>{
    // const material = await Material.findById(req.params.id).populate('category');
    const material = await Material.findById(req.params.id);

    if(!material) {
        res.status(500).json({success: false})
    } 
    res.send(material);
})

router.post(`/new`, (req, res) => {

    uploadOptions(req, res, async (err) => {
        if (err) {
            return res.status(500).json({success: false, error: err})
        } else {
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).send('NO IMAGES IN THE REQUEST');
            }

        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        let materialPaths = [];
        files.forEach(file => {
            const fileName = file.filename;
            materialPaths.push(`${basePath}${fileName}`);
        });

        const material = new Material({
            name: req.body.name,
            price: req.body.price,
            countInStock: req.body.countInStock,
            image: materialPaths
        });

        try {
            const savedMaterial = await material.save();
            res.status(201).send(savedMaterial);
        } catch (error) {
            return res.status(500).json({success: false, error: err})
        }
    }
});
});


router.put('/:id', uploadOptions, async (req, res) => {
    console.log(req.body);
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('INVALID PHOTO ID');
    }

    const material = await Material.findById(req.params.id);
    if (!material) return res.status(400).send('Invalid Material!');
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        req.files.forEach(file => {
            const fileName = file.filename;
            const imagePath = `${basePath}${fileName}`;
            imagePaths.push(imagePath);
        });
    } else {
        // If no files are uploaded, use the existing image paths
        imagePaths = material.image;
    }

    const updatedMaterial = await Material.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            price: req.body.price,
            countInStock: req.body.countInStock,
            image: imagePaths
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



module.exports=router;