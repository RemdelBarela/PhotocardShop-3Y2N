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
    console.log(req.query)
    let filter = {};
    const materialList = await Material.find(filter);

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

router.post(`/new`, uploadOptions.single('image'), async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let material = new Material({
        name: req.body.name,
         price: req.body.price,
        image: `${basePath}${fileName}`, 
        countInStock: req.body.countInStock,
        
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
            price: req.body.price,
            image: imagepath,
           countInStock: req.body.countInStock,
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