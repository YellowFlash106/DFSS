-- CreateTable
CREATE TABLE "ChunkReplica" (
    "id" TEXT NOT NULL,
    "chunkId" TEXT NOT NULL,
    "node" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChunkReplica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChunkReplica_chunkId_node_key" ON "ChunkReplica"("chunkId", "node");

-- AddForeignKey
ALTER TABLE "ChunkReplica" ADD CONSTRAINT "ChunkReplica_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "Chunk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
