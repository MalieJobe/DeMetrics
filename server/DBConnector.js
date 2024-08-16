import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import fs from 'fs';


export default class DBConnector {
    /**
   * Private constructor to prevent direct instantiation.
   * @param {object} db - The SQLite database instance.
   */
    constructor(db) {
        if (DBConnector._instance) {
            throw new Error('Use DBConnector.getInstance() to get the singleton instance.');
        }
        this.db = db;
        DBConnector._instance = this;
    }

    /**
     * Static method to get the singleton instance of DBConnector.
     * @param {string} dbFilePath - The path to the SQLite database file.
     * @returns {Promise<DBConnector>} - The singleton instance of DBConnector.
     */
    static async getInstance(dbFilePath) {
        if (DBConnector._instance) {
            return DBConnector._instance;
        }
        if (!dbFilePath) {
            throw new Error('Database file path must be provided to initialize DBConnector.');
        }

        if (!fs.existsSync(dbFilePath)) {
            console.error('Database file does not exist:', dbFilePath);
        } else {
            console.log('Database file found:', dbFilePath);
        }

        const db = await open({
            filename: dbFilePath,
            driver: sqlite3.Database,
        });
        return new DBConnector(db);
    }

    /**
     * Retrieves a single row from the database based on the provided SQL query and parameters.
     * 
     * @param {string} sql - The SQL query to execute.
     * @param {Array<string>} params - The parameters to bind to the SQL query.
     * @returns {Promise<Object>} - A promise that resolves to the retrieved row from the database.
     * @throws {Error} - If there is an error executing the SQL query or if no row is found.
     */
    async getSingleRow(sql, params) {
        const result = await this.db.get(sql, params, (err, row) => {
            if (err) {
                throw new Error(err.message);
            }
            if (!row) {
                console.log("No data found");
            }
        });
        return result;
    }

    async getMultipleRows(sql, params) {
        const result = await this.db.all(sql, params, (err, rows) => {
            if (err) {
                throw new Error(err.message);
            }
            if (!rows || rows.length === 0) {
                console.log("No data found");
            }
        });
        return result;
    }

    async getSingleValues(sql, params) {
        const result = await this.getSingleRow(sql, params);

        if (result) {
            // Extract the first property value from the result object
            const key = Object.keys(result)[0];
            return Math.min(result[key], 1); // return 1 at most, something cant be more than 100%
        } else {
            return 1;
        }
    }


    async getAgePercentage(minAge = 14, maxAge = 100, gender = 'total') {
        if (!['total', 'female', 'male'].includes(gender)) throw new Error("Invalid specified gender");
        if (minAge < 0 || maxAge > 100) throw new Error("Invalid age range");
        if (minAge > maxAge) throw new Error("minAge must be less than or equal to maxAge");

        const sql = `SELECT SUM(${gender}) FROM age WHERE age_min >= ? AND age_max <= ?`;

        return await this.getSingleValues(sql, [minAge, maxAge]);
    }

    async getGenderPercentage(gender = 'total') {
        if (!['female', 'male', 'total'].includes(gender)) throw new Error("Invalid gender specified");
        if (gender === 'total') return 1; // duh

        const sql = `SELECT percentage FROM gender WHERE gender = ?`;
        return await this.getSingleValues(sql, [gender]);
    }

    async getHeightPercentage(minHeight = 0, maxHeight = 300, gender = 'total') {
        if (!['total', 'female', 'male'].includes(gender)) throw new Error("Invalid specified gender");
        if (minHeight < 0 || maxHeight > 300) throw new Error("Invalid height range");
        if (minHeight > maxHeight) throw new Error("minHeight must be less than or equal to maxHeight");
        if (minHeight > 190 || maxHeight < 149) throw new Error("Height range not supported");

        let sql;
        if (gender === 'total') {
            sql = `SELECT SUM(female + male) / 2 FROM height WHERE height_min >= ? AND height_max <= ?`;
        } else {
            sql = `SELECT SUM(${gender}) FROM height WHERE height_min >= ? AND height_max <= ?`;
        }
        return await this.getSingleValues(sql, [minHeight, maxHeight]);
    }

    async getIncomePercentage(minIncome = -Infinity, maxIncome = Infinity) {
        if (minIncome > maxIncome) throw new Error("minIncome must be less than or equal to maxIncome");

        const sql = `SELECT SUM(percent) FROM income WHERE income_min >= ? AND income_max <= ?`;
        return await this.getSingleValues(sql, [minIncome, maxIncome]);
    }

    async getWeightPercentage(minWeight = 'underweight', maxWeight = 'obese', minAge = 18, maxAge = 100, gender = 'total') {
        if (!['total', 'female', 'male'].includes(gender)) throw new Error("Invalid gender specified");

        const possibleWeightCategories = ['underweight', 'normal', 'overweight', 'obese'];
        if (!possibleWeightCategories.includes(minWeight)) throw new Error("Invalid minWeight specified");
        if (!possibleWeightCategories.includes(maxWeight)) throw new Error("Invalid maxWeight specified");
        const minWeightIndex = possibleWeightCategories.indexOf(minWeight);
        const maxWeightIndex = possibleWeightCategories.indexOf(maxWeight);
        if (minWeightIndex > maxWeightIndex) {
            throw new Error("minWeight must passed in before maxWeight");
        }

        const selectedWeights = possibleWeightCategories.slice(minWeightIndex, maxWeightIndex + 1);

        let sql;
        if (gender === 'total') {
            sql = `SELECT SUM(${selectedWeights.join(' + ')}) / 2 FROM weight WHERE age_max >= ? AND age_min <= ?`;
            return await this.getSingleValues(sql, [minAge, maxAge]);
        } else {
            sql = `SELECT SUM(${selectedWeights.join(' + ')}) FROM weight WHERE age_max >= ? AND age_min <= ? AND gender = ?`;
            return await this.getSingleValues(sql, [minAge, maxAge, gender]);
        }
    }

    async getSinglesPercentage(minAge = 14, maxAge = 100) {
        if (minAge > maxAge) throw new Error("minAge must be less than or equal to maxAge");

        const sql = `SELECT SUM(percent) / COUNT(percent) FROM relationship_status WHERE age_max >= ? AND age_min <= ?`;
        return await this.getSingleValues(sql, [minAge, maxAge]);
    }

    async getTestData() {
        const sql = 'SELECT * FROM age';
        const res = await this.db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(err.message);
            }
        });
        return res;
    }

    async getMinMaxFromTable(tableName, columnMin, columnMax) {
        const sql = `SELECT MIN(${columnMin}) as min, MAX(${columnMax || columnMin}) as max FROM ${tableName}`;
        return await this.getSingleRow(sql, []);
    }

    async getFullRangeFromTable(tableName, columnMin, columnMax) {
        const sql = `SELECT ${columnMin}, ${columnMax} FROM ${tableName}`;
        let rows = await this.getMultipleRows(sql, []);

        // Combine all age_min and age_max values into one array
        rows = rows.flatMap(item => [item[columnMin], item[columnMax]]);
        rows = [...new Set(rows)]; // Remove duplicates

        // Sort the array in ascending order
        rows = rows.sort((a, b) => a - b);

        // Filter for income, only keep multiples of 5000
        if (tableName === "income") {
            rows = rows.filter(value => value % 5000 === 0 || !isFinite(value));
        }

        return rows;
    }
}


// const dbPath = './server/data/demographics.sqlite';
// const dbc = await DBConnector.getInstance(dbPath);

// const ageRange = await dbc.getFullRangeFromTable('age', 'age_min', 'age_max');
// console.log(ageRange);

// const heightRange = await dbc.getFullRangeFromTable('height', 'height_min', 'height_max');
// console.log(heightRange);

// const incomeRange = await dbc.getFullRangeFromTable('income', 'income_min', 'income_max');
// console.log(incomeRange);

// const weightRange = await dbc.getFullRangeFromTable('weight', 'age_min', 'age_max');
// console.log(weightRange);

// const relationshipRange = await dbc.getFullRangeFromTable('relationship_status', 'age_min', 'age_max');
// console.log(relationshipRange);


// const ageMinMax = await dbc.getMinMaxFromTable('age', 'age_min', 'age_max');
// console.log(ageMinMax);

// const heightMinMax = await dbc.getMinMaxFromTable('height', 'height_min', 'height_max');
// console.log(heightMinMax);

// const incomeMinMax = await dbc.getMinMaxFromTable('income', 'income_min', 'income_max');
// console.log("income", incomeMinMax);

// const weightMinMax = await dbc.getMinMaxFromTable('weight', 'age_min', 'age_max');
// console.log(weightMinMax);

// const relationshipMinMax = await dbc.getMinMaxFromTable('relationship_status', 'age_min', 'age_max');
// console.log(relationshipMinMax);

// const incomeMinMax = await dbc.getMinMaxFromTable('income', 'income_min', 'income_max');
// console.log(incomeMinMax);

// const weightMinMax = await dbc.getMinMaxFromTable('weight', 'age_min', 'age_max');
// console.log(weightMinMax);

// const relationshipMinMax = await dbc.getMinMaxFromTable('relationship_status', 'age_min', 'age_max');
// console.log(relationshipMinMax);




// const ageData = await dbc.getAgePercentage(0, 100, "male")
// console.log(ageData);

// const ageDatas = await dbc.getAgePercentage(10, 80, "total")
// console.log(ageDatas);

// const genderData = await dbc.getGenderPercentage('male');
// console.log(genderData);

// const heightData = await dbc.getHeightPercentage(149, 190, 'total');
// console.log(heightData);

// const incomeData = await dbc.getIncomePercentage(0, 10000);
// console.log(incomeData);

// const getSinglesData = await dbc.getSinglesPercentage(18, 100);
// console.log(getSinglesData);

// const weightData = await dbc.getWeightPercentage('underweight', 'obese', 20, 23, 'male');
// console.log(weightData);

// const weightDatas = await dbc.getWeightPercentage('underweight', 'normal', 20, 23, 'total');
// console.log(weightDatas);