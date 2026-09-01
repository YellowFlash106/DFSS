const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");
const redis = require("../utils/redis");
const crypto = require("crypto");

const createFile = asyncHandler(async (req, res) => {
    const { name, size, mimetype, folderId } = req.body;
    const newFile = await prisma.file.create({
        data: {
            name,
            size,
            mimeType: mimetype,
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
        where: { id: fileId },
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

    const cacheKey = `file:${userId}:${fileId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.json({ source: 'cache', file: JSON.parse(cached) });
    }
    const file = await prisma.file.findUnique({
        where: {
            id: fileId,
            userId: userId,
        },
    });

    const share = await prisma.share.findUnique({
        where: {
            fileId_userId: {
                fileId: fileId,
                userId: req.user.userId,
            }
        }
    })

    if (!file || (file.userId !== userId && !share)) {
        throw new Error("File not found or access denied");
    }
    
    if (file.userId !== userId) {
        const share = await prisma.share.findUnique({
            where: {
                fileId_userId: { fileId, userId },
            },
        });

        if (!share || share.permission !== "WRITE") {
            throw new Error("File not found or Access denied");
        }
    }

    await redis.set(cacheKey, JSON.stringify(file), {
        EX: 60,
    });

    res.json({ source: 'database', file });
});

const generatePublicLink = asyncHandler(async (req, res) => {
    const fileId = req.body.fileId || req.params.fileId;

    if (!fileId) {
        throw new Error("fileId is required");
    }

    const file = await prisma.file.findUnique({
        where: { id: fileId },
    });

    if (!file || file.userId !== req.user.userId) {
        throw new Error("File not found or access denied");
    }

    const token = crypto.randomBytes(16).toString('hex');

    await prisma.file.update({
        where: {
            id: fileId,
        },
        data: {
            publicToken: token,
        },
    });

    res.json({
        message: "Public link generated successfully",
        link: `/api/files/public/${token}`,
    });
});

const getPublicFile = asyncHandler(async (req, res) => {

    const { token } = req.params;

    const file = await prisma.file.findUnique({
        where: { publicToken: token },
    });

    if (!file) {
        throw new Error("File not found");
    }

    res.json({
        message: "Public file access",
        file,
    });
});

module.exports = { createFile, getFiles, finalizeFile, getFileById, generatePublicLink, getPublicFile };
