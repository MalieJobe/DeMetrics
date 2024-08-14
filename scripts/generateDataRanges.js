import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import DBConnector from "../server/DBConnector.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the output directory and file paths
const outputDir = path.join(__dirname, '../content');
const outputFilePath = path.join(outputDir, 'ranges.json');

// Ensure the output directory exists, create it if it doesn't
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to fill in missing numbers dynamically
function fillMissingNumbers(arr, step = 1) {
    if (arr.length === 0) return arr;

    const result = [];

    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        const next = arr[i + 1];

        result.push(current);

        if (isFinite(current) && isFinite(next)) {
            for (let j = current + step; j < next; j += step) {
                result.push(j);
            }
        }
    }

    return result;
}

// Main function to generate ranges and save to JSON
async function generateRanges() {
    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    const ranges = {};

    // Define the tables and columns to process
    const columnsToProcess = [
        { tableName: 'age', columnMin: 'age_min', columnMax: 'age_max' },
        { tableName: 'height', columnMin: 'height_min', columnMax: 'height_max' },
        { tableName: 'weight', columnMin: 'weight_min', columnMax: 'weight_max' },
        { tableName: 'income', columnMin: 'income_min', columnMax: 'income_max' },
        // Add more tables/columns if needed
    ];

    for (const { tableName, columnMin, columnMax } of columnsToProcess) {
        let data;

        if (tableName === "weight") {
            // Fixed weight categories
            data = ["underweight", "normal", "overweight", "obese"];
        } else if (tableName === "income") {
            // Get data from the income table, and fill in the missing numbers with a step of 5000
            const rawData = await dbc.getFullRangeFromTable(tableName, columnMin, columnMax);
            data = fillMissingNumbers(rawData, 5000);
        } else {
            // General case: fill in missing numbers with step 1
            const rawData = await dbc.getFullRangeFromTable(tableName, columnMin, columnMax);
            data = fillMissingNumbers(rawData);
        }

        // Convert Infinity values to string to make them JSON-compatible
        data = data.map(value =>
            value === Infinity ? 'Infinity' : value === -Infinity ? '-Infinity' : value
        );

        ranges[tableName] = data;
    }

    // Write the ranges to a JSON file
    const outputFilePath = path.join(__dirname, '../content/ranges.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(ranges, null, 2));
    console.log(`Ranges generated and saved to ${outputFilePath}`);
}

// Run the function to generate the ranges
generateRanges().catch(error => {
    console.error('Error generating ranges:', error);
});
