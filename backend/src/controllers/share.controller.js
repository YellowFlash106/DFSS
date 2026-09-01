const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');

const shareFile = asyncHandler(async (req, res) => {
    const { fileId, targetUserEmail, permission } = req.body;

    if (!fileId || !targetUserEmail) {
        throw new Error("fileId and targetUserEmail are required");
    }

    const targetUser = await prisma.user.findUnique({
        where: { email: targetUserEmail },
    });

    if (!targetUser) {
        throw new Error("Target user not found");
    }

    const file = await prisma.file.findUnique({
        where: { id: fileId },
    });

    if (!file || file.userId !== req.user.userId) {
        throw new Error('Not authorized to share this file');
    }

    const share = await prisma.share.upsert({
        where: {
            fileId_userId: {
                fileId: fileId,
                userId: targetUser.id,
            },
        },
        update: {
            permission: permission || 'READ',
        },
        create: {
            fileId,
            userId: targetUser.id,
            permission: permission || 'READ',
        },
    });

    res.status(201).json({ message: 'File shared successfully', share });
});

const getSharedFiles = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const shares = await prisma.share.findMany({
        where: { userId },
        include: { file: true },
    });

    const files = shares.map((s) => s.file);

    res.json({ files })
});

module.exports = {
    shareFile,
    getSharedFiles,
};