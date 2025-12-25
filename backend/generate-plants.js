
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// Helper to generate a random plant
const generatePlant = (type, index) => {
    const isIndoor = type === 'indoor';
    const id = `p_${isIndoor ? 'in' : 'out'}_${100 + index}`;

    // Realistic plant names list to pick from if we wanted real ones, 
    // but here we use faker for variety or realistic sounding Latin names
    const commonName = faker.science.chemicalElement().name + (isIndoor ? " Fern" : " Bush");
    const scientificName = faker.person.lastName() + " " + faker.science.unit().name.toLowerCase();

    return {
        id,
        name: commonName,
        scientificName: scientificName.charAt(0).toUpperCase() + scientificName.slice(1),
        description: faker.lorem.sentences(2),
        imageUrl: `https://images.unsplash.com/photo-${faker.number.int({ min: 1000000000, max: 9999999999 })}?auto=format&fit=crop&w=800&q=80`, // Randomized Unsplash URL structure
        idealTempMin: faker.number.int({ min: 5, max: 15 }),
        idealTempMax: faker.number.int({ min: 25, max: 35 }),
        minHumidity: faker.number.int({ min: 30, max: 80 }),
        sunlight: isIndoor ? faker.helpers.arrayElement(['low', 'medium', 'high']) : 'high',
        oxygenLevel: faker.helpers.arrayElement(['low', 'moderate', 'high', 'very-high']),
        medicinalValues: [faker.word.adjective(), faker.word.noun()],
        advantages: [faker.company.buzzAdjective(), faker.company.buzzNoun()],
        price: faker.number.int({ min: 10, max: 200 }),
        type: type,
        foliageTexture: isIndoor ? "Glossy/Smooth" : "Matte/Textured",
        leafShape: isIndoor ? "Ovate-Elliptical" : "Lanceolateish/Compound",
        stemStructure: isIndoor ? "Herbaceous" : "Woody/Semi-Woody",
        overallHabit: isIndoor ? "Upright/Bushy" : "Spreading/Climbing",
        biometricFeatures: isIndoor ? ["Interior Adapted", "Smooth Edges"] : ["Sun Hardy", "Outdoor Adapted"]
    };
};

const newIndoorPlants = Array.from({ length: 50 }, (_, i) => generatePlant('indoor', i));
const newOutdoorPlants = Array.from({ length: 50 }, (_, i) => generatePlant('outdoor', i));

const dataFilePath = path.join(__dirname, 'plant-data.js');

// Read existing data
let fileContent = fs.readFileSync(dataFilePath, 'utf8');

// We need to inject these arrays into the existing file. 
// This is a bit tricky with string replacement, so we'll append them to the export logic 
// or valid JSON structure depending on file format.
// The file format seen is `const indoorPlants = [...]; const outdoorPlants = [...]; module.exports = ...`

// Strategy: construct the new object strings and inject them before the array closing bracket `];`
// We identify the last `];` corresponding to indoorPlants and outdoorPlants.

// However, a safer way for this script (which runs once):
// Print them out in a JSON format that the user can copy-paste, OR
// Programmatically append them to the DB directly would be better if we had DB access here.
// Since we are modifying a JS file that acts as a seed:

// Let's create a NEW file `extended-plant-data.js` with the merged data to avoid corrupting the original with regex.
// We will read the original arrays (eval is dangerous but effective for simple data files, or require it).

const currentData = require('./plant-data');
const { indoorPlants, outdoorPlants } = currentData;

const finalIndoor = [...indoorPlants, ...newIndoorPlants];
const finalOutdoor = [...outdoorPlants, ...newOutdoorPlants];

const newFileContent = `// Extended Plant Data Module
const indoorPlants = ${JSON.stringify(finalIndoor, null, 4)};

const outdoorPlants = ${JSON.stringify(finalOutdoor, null, 4)};

module.exports = { indoorPlants, outdoorPlants };
`;

fs.writeFileSync(path.join(__dirname, 'plant-data.js'), newFileContent);

console.log("Successfully added 50 indoor and 50 outdoor plants to plant-data.js");
