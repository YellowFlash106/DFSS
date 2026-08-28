const prisma = require("../utils/prisma");

const createFile = async (req, res) => {
    try {
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
        
    } catch (error) {
        console.error("Error creating file:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getFiles = async (req, res) => {
    try {
        const files = await prisma.file.findMany({
            where: {
                userId: req.user.userId,
            },
        });
        res.json({ files });
    } catch (error) {
        console.error("Error getting files:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createFile, getFiles };
