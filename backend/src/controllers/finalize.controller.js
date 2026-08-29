const mergeChunks = require("../utils/merge");
const prisma = require("../prisma");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");

const AppError = require("../utils/AppError");

const finalizeUpload = asyncHandler(async (req, res) => {
  const { fileId, totalChunks } = req.body;

  const chunks = await prisma.chunk.findMany({
    where: { fileId },
    orderBy: { index: "asc" },
  });

  if (chunks.length !== Number(totalChunks)) {
    return res.status(400).json({
      message: "Missing chunks",
      uploaded: chunks.length,
    });
  }

  const chunkPaths = chunks.map((c) => c.path);

  const outputPath = path.join(
    "uploads/final",
    `${fileId}.bin`
  );

  await mergeChunks(chunkPaths, outputPath);

  await prisma.file.update({
    where: { id: fileId },
    data: { status: "READY" },
  });

  res.json({
    message: "File finalized successfully",
    path: outputPath,
  });
});

module.exports.finalizeUpload = finalizeUpload;