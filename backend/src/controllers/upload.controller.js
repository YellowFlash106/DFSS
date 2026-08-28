const fs = require('fs');
const path = require('path');
const upload = require('../utils/multer');

const uploadChunk = (req, res) => {
    try {
        const { fileId, chunkIndex, totalChunks } = req.body;
        const file = req.file;

        if(!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const chunkPath = file.path;
        res.status(200).json({ message: 'Chunk uploaded successfully', chunkPath,
            path: chunkPath,
         });

    } catch (error) {
        res.error(500).json({ message: 'Error uploading file', error: error.message });
    }
}

module.exports = {
    uploadChunk,
};