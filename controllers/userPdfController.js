const userPdfModel = require('../models/userPdfModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/pdfs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('pdf');

const uploadUserPDF = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to upload PDF' });
        }
        const userId = req.body.userId;
        const pdfUrl = req.file.path;

        try {
            const pdfId = await userPdfModel.insertUserPDF(userId, pdfUrl);
            res.status(201).json({ pdfId });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save PDF to database' });
        }
    });
};

const getUserPDFById = async (req, res) => {
    const { id } = req.params;
    try {
        const pdf = await userPdfModel.getUserPDFById(id);
        if (pdf) {
            res.status(200).json({pdf_url: pdf.pdf_url});
        } else {
            res.status(404).json({ error: 'User PDF not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user PDF' });
    }
};

module.exports = {
    uploadUserPDF,
    getUserPDFById
};
