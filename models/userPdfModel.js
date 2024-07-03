const db = require('../config/db');

const insertUserPDF = async (userId, pdfUrl) => {
    const [result] = await db.query(
        'INSERT INTO PDFs (user_id, pdf_url) VALUES (?, ?)',
        [userId, pdfUrl]
    );
    return result.insertId;
};

const getUserPDFById = async (id) => {
    const [rows] = await db.query('SELECT * FROM PDFs WHERE user_id = ?', [id]);
    return rows[0];
};

module.exports = {
    insertUserPDF,
    getUserPDFById
};
