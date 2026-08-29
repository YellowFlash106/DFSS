const nodes = ["node1", "node2", "node3"]; 

const getPrimaryNode = (fileId, chunkIndex) => {
    const hash = (fileId + chunkIndex)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return nodes[hash%nodes.length];
}

const getReplicaNode = (primary) => {
    const index = nodes.indexOf(primary);

    return [
        primary,
        nodes[(index +1) % nodes.length],
    ]

}

module.exports = { getPrimaryNode, getReplicaNode };