const fs = require('fs');
const path = require('path');
const upload = require('../utils/multer');
const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const { getPrimaryNode, getReplicaNode } = require('../utils/storageNode');

const uploadChunk = asyncHandler(async (req, res) => {
    const { fileId, chunkIndex } = req.body;
    const file = req.file;

    if (!file) {
        throw new AppError('No file uploaded', 400);
    }

    const dbFile = await prisma.file.findUnique({
        where: { id: fileId },
    });

    if (!dbFile || dbFile.userId !== req.user.userId) {
        throw new AppError('Forbidden', 403);
    }

    const index = Number(chunkIndex);
    if (!Number.isInteger(index) || index < 0) {
        throw new AppError('Invalid chunk index', 400);
    }

    let chunk = await prisma.chunk.findUnique({
        where: {
            fileId_index: {
                fileId: fileId,
                index,
            }
        }
    });

    if (!chunk) {
        chunk = await prisma.chunk.create({
            data: {
                fileId: fileId,
                index,
                path: "",
                size: file.size,
            },
        });
    }

    const primary = getPrimaryNode(fileId, index);
    const nodes = getReplicaNode(primary);
    const replicas = [];

    for (const node of nodes) {
        const nodePath = path.join(
            "storage",
            node,
            `${fileId}_${index}`
        );

        fs.mkdirSync(path.dirname(nodePath), { recursive: true });
        fs.copyFileSync(file.path, nodePath);

        if (node === primary) {
            await prisma.chunk.update({
                where: { id: chunk.id },
                data: { path: nodePath, size: file.size },
            });
        } else {
            replicas.push({ chunkId: chunk.id, node, path: nodePath });
        }
    }

    if (replicas.length > 0) {
        await prisma.chunkReplica.createMany({ data: replicas, skipDuplicates: true });
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