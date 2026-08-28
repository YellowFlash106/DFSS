const prisma = require("../utils/prisma");

const createFolder = async (req, res) => {
    try {
        const { name, parentId } = req.body;

        const newFolder = await prisma.folder.create({
            data: {
                name,
                parentId: parentId || null,
                userId: req.user.userId,
            },
        });
        res.json({ message: "Folder created successfully", folder: newFolder });
        
    } catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getFolders = async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({
            where: {
                userId: req.user.userId,
            },
        });
        res.json({ folders });
    } catch (error) {
        console.error("Error getting folders:", error);
        res.status(500).json({ message: "Server error" });
    }
}