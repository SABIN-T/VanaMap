import { readFileSync, writeFileSync } from 'node:fs';

const content = readFileSync('src/data/mocks.ts', 'utf8');
const regex = /"scientificName":\s*"([^"]+)"/g;
let match;
const names = [];
while ((match = regex.exec(content)) !== null) {
    names.push(match[1]);
}
// Also get common names if possible to make the table complete
const regexCommon = /"name":\s*"([^"]+)"/g;
const commonNames = [];
let matchCommon;
while ((matchCommon = regexCommon.exec(content)) !== null) {
    commonNames.push(matchCommon[1]);
}

const combined = names.map((sci, i) => ({
    scientific: sci,
    common: commonNames[i] || "Unknown"
}));

writeFileSync('names.json', JSON.stringify(combined, null, 2));
console.log("Written " + names.length + " names to names.json");
