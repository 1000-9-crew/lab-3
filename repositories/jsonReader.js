const fs = require('fs');
const path = require('path');

const filePath = (filename) => path.join(__dirname, '../data', filename);

async function readJson(filename) {
    const data = await fs.promises.readFile(filePath(filename), 'utf8');
    return JSON.parse(data);
}

async function writeJson(filename, content) {
    await fs.promises.writeFile(filePath(filename), JSON.stringify(content, null, 2), 'utf8');
}

module.exports = { readJson, writeJson };