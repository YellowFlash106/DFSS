const fs = require('fs');
const path = require('path');
const upload = require('../utils/multer');
const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const { getPrimaryNode, getNode } = require('../utils/storageNode');

const uploadChunk = asyncHandler(async (req, res) => {
    const { fileId, chunkIndex } = req.body;
    const file = req.file;

    if (!file) {
        throw new AppError('No file uploaded', 400);
    }

    if (file.userId !== req.user.userId) {
        throw new AppError('Unauthorized', 403);
    }

    const dbFile = await prisma.file.findUnique({
        where: { id: fileId },
    });

    if (dbFile.userId !== req.user.userId) {
        throw new AppError('Forbidden', 403);
    }

    let chunk = await prisma.chunk.findUnique({
        where: {
            fileId_chunkIndex: {
                fileId: fileId,
                chunkIndex: Number(chunkIndex),
            }
        }
    });

    if (!chunk) {
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

    for (const node of nodes) {
        const nodePath = path.join(
            "storage",
            node,
            `${fileId}_${chunkIndex}`
        );

        fs.copyFileSync(file.path, nodePath);

        await prisma.chunk.update({
            data: {
                chunkId: chunk.id,
                node,
                path: nodePath
            },
        });
    }

    fs.unlinkSync(file.path);

    res.status(200).json({
        message: 'Chunk replicated successfully',
        replicas: nodes
    });
});

const getUploadedChunks = asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const chunks = await prisma.chunk.findMany({
        where: { fileId },
        orderBy: { index: 'asc' },
        select: { index: true },
    });

    res.status(200).json({
        uploaded: chunks.map(chunk => chunk.index),
    });
});

module.exports = {
    uploadChunk,
    getUploadedChunks
};