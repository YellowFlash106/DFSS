const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");
const redis = require("../utils/redis");

const createFile = asyncHandler(async (req, res) => {
    const { name, size, mimetype, folderId } = req.body;
    const newFile = await prisma.file.create({
        data: {
            name,
            size,
            mimetype,
            folderId: folderId || null,
            userId: req.user.userId,
        },
    });

    res.json({ message: "File created successfully", file: newFile });
});

const getFiles = asyncHandler(async (req, res) => {
    const files = await prisma.file.findMany({
        where: {
            userId: req.user.userId,
        },
    });

    res.json({ files });
});

const finalizeFile = asyncHandler(async (req, res) => {
    const { fileId } = req.body;

    const file = await prisma.file.update({
        where: { id: parseInt(fileId) },
        data: {
            isFinalized: true,
            status: 'READY'
        },
    });

    res.json({ message: "File finalized successfully", file });
});

const getFileById = asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user.userId;

    const cacheKey = `file:${fileId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.json({  source: 'cache', file: JSON.parse(cached) });
    }
    const file = await prisma.file.findFirst({
        where: {
            id: parseInt(fileId),
            userId: userId,
        },
    });
    if (!file || file.userId !== userId) {
        throw new Error("File not found or access denied");
    }

    await redis.set(cacheKey, JSON.stringify(file), {
        EX: 60,  
    });

    res.json({ source: 'database', file });
})

module.exports = { createFile, getFiles, finalizeFile, getFileById };
