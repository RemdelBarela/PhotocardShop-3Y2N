const express = require('express');
const { Photo } = require('../models/photo');
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

const uploadOptions = multer({ storage: storage }).array('images', 10); // Adjust for multiple files

router.get(`/`, async (req, res) =>{
    
    console.log(req.query)
       
    const photoList = await Photo.find();

    if(!photoList) {
        res.status(500).json({success: false})
    } 
    res.send(photoList);
})

router.get(`/:id`, async (req, res) =>{
    const photo = await Photo.findById(req.params.id);

    if(!photo) {
        res.status(500).json({success: false})
    } 
    res.send(photo);
})

router.post(`/new`, (req, res) => {
    uploadOptions(req, res, async (err) => {
        if (err) {
            // Handle upload error
        } else {
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).send('NO IMAGES IN THE REQUEST');
            }

            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            let photoPaths = [];
            files.forEach(file => {
                const fileName = file.filename;
                photoPaths.push(`${basePath}${fileName}`);
            });

            let photos = [];
            for (let i = 0; i < photoPaths.length; i++) {
                let photo = new Photo({
                    name: req.body.name,
                    description: req.body.description,
                    image: photoPaths[i]
                });
                photo = await photo.save();
                photos.push(photo);
            }

            res.send(photos);
        }
    });
});

// router.put('/:id', uploadOptions.single('image'), async (req, res) => {

//     console.log(req.body);
//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send('INVALID PHOTO ID');
//     }
   
//     const photo = await Photo.findById(req.params.id);
//     if (!photo) return res.status(400).send('INVALID PHOTO!');

//     const file = req.file;
//     let imagepath;

//     if (file) {
//         const fileName = file.filename;
//         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//         imagepath = `${basePath}${fileName}`;
//     } else {
//         imagepath = photo.image;
//     }

//     const updatedPhoto = await Photo.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             description: req.body.description,
//             image: imagepath,
//         },
//         { new: true }
//     );

//     if (!updatedPhoto) return res.status(500).send('THE PHOTO CANNOT BE UPDATED!');

//     res.send(updatedPhoto);
// });

router.delete('/:id', (req, res)=>{
    Photo.findByIdAndRemove(req.params.id).then(photo =>{
        if(photo) {
            return res.status(200).json({success: true, message: 'THE PHOTO IS DELETED!'})
        } else {
            return res.status(404).json({success: false , message: "PHOTO NOT FOUND!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const photoCount = await Photo.countDocuments((count) => count)

    if(!photoCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        photoCount: photoCount
    });
})

module.exports=router;