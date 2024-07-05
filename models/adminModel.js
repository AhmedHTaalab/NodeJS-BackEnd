const db = require('../config/db');

const createAdmin = async (admin) => {
    const [result] = await db.query(
        'INSERT INTO admin (National_ID) VALUES (?)',
        [admin.National_ID]
    );
    return result.insertId;
};

module.exports = {
    createAdmin
};