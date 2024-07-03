const fs = require('fs');
const path = require('path');
const userImageModel = require('../models/userImageModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

const uploadUserImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to upload image' });
        }
        const userId = req.body.userId;
        const newImageUrl = req.file.path;

        try {
            // Check if an image already exists for the user
            const existingImage = await userImageModel.getUserImageById(userId);
            if (existingImage) {
                // Delete the old image file
                fs.unlink(existingImage.image_url, (err) => {
                    if (err) {
                        console.error('Failed to delete old image file:', err);
                    }
                });
            }

            // Insert or update the new image URL in the database
            await userImageModel.insertOrUpdateUserImage(userId, newImageUrl);
            res.status(201).json({ imageUrl: newImageUrl });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save image to database' });
        }
    });
};

const getUserImageById = async (req, res) => {
    const { id } = req.params;
    try {
        const image = await userImageModel.getUserImageById(id);
        if (image) {
            const formattedPath = image.image_url.replace(/\\/g, '/');
            const fullUrl = req.protocol + '://' + req.get('host') + '/' + formattedPath;
            res.status(200).json({ image_url: fullUrl });
        } else {
            res.status(404).json({ error: 'User image not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user image' });
    }
};

module.exports = {
    uploadUserImage,
    getUserImageById
};
