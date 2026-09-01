const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");

const createFolder = asyncHandler(async (req, res) => {
    const { name, parentId } = req.body;

    const newFolder = await prisma.folder.create({
        data: {
            name,
            parentId: parentId || null,
            userId: req.user.userId,
        },
    });

    res.json({ message: "Folder created successfully", folder: newFolder });
});

const getFolders = asyncHandler(async (req, res) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.userId,
        },
    });

    res.json({ folders });
});

module.exports = { createFolder, getFolders };