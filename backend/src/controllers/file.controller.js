const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

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

module.exports = { createFile, getFiles, finalizeFile };
