const fs = require('fs');
const path = require('path');
const upload = require('../utils/multer');
const prisma = require('../utils/prisma');

const { getPrimaryNode, getNode } = require('../utils/storageNode');

const uploadChunk = async (req, res) => {
    try {
        const { fileId, chunkIndex } = req.body;
        const file = req.file;

        if(!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (file.userId !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // ownerShip check
        const dbFile = await prisma.file.findUnique({
            where: { id: fileId },
        });

        if(dbFile.userId !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        let chunk = await prisma.chunk.findUnique({
            where: {
                fileId_chunkIndex: {
                    fileId: fileId,
                    chunkIndex: Number(chunkIndex),
                }
            }
        })

        if(!chunk){
            chunk = await prisma.chunk.create({
                data: {
                    fileId: fileId,
                    chunkIndex: Number(chunkIndex),
                    path: "",
                    size: file.size,
                },
            });
        }

        const primary = getPrimaryNode(fileId, chunkIndex);
        const nodes = getNode(primary);

        for(const node of nodes){
            const nodePath = path.join(
                "storage",
                node,
                `${fileId}_${chunkIndex}`
            );

            fs.copyFileSync(file.path, nodePath);

            await prisma.chunk.update({
                data: {
                    chunkId: chunk.id,
                    node, path: nodePath
                },
            });
        }

        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'Chunk replicated successfully', 
            replicas: nodes
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
}

const getUploadedChunks = async (req, res)=> {
    try {

        const { fileId } = req.params;
        const chunks = await prisma.chunk.findMany({
            where: { fileId },
            orderBy: { index: 'asc' },
            select : { index: true },
        });

        res.status(200).json({
            uploaded: chunks.map(chunk => chunk.index),
        });
    } catch (error) {

        res.status(500).json({ message: 'Error fetching uploaded chunks', error: error.message });
    }
}

module.exports = {
    uploadChunk,
    getUploadedChunks
};