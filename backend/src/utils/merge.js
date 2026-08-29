const fs = require('fs');

const mergeChunks = async ( chunks, outputPath, prisma) => {
    const writeStream = fs.createWriteStream(outputPath);

    for(const chunk of chunks){
        const replicas = await prisma.chunkReplica.findMany({
            where: {
                chunkId: chunk.id
            }
        });

        let chunkData = null;

        for(const replica of replicas){
            try {
                chunkData = fs.readFileSync(replica.path);
                break; // success 
            } catch (error) {
                continue; // try next replica if the current one fails
            }
        }

        if(!chunkData){
            throw new Error("Chunk missing in all replicas");
        }
        
        writeStream.write(chunkData);
    }
    writeStream.end();
}

module.exports = mergeChunks;