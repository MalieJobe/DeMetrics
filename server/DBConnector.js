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

    async getAgePercentage(minAge = 14, maxAge = 100, gender = 'total') {
        if (!['total', 'female', 'male'].includes(gender)) throw new Error("Invalid specified gender");
        if (minAge < 0 || maxAge > 100) throw new Error("Invalid age range");

        const genderColumn = gender + '_percent';
        const sql = `SELECT SUM(${genderColumn}) FROM age WHERE age_start >= ? AND age_end <= ?`;

        return await this.getSingleRow(sql, [minAge, maxAge]);
    }

    async getGenderPercentage(gender) {
        if (gender !== 'female' || gender !== 'male') throw new Error("Invalid gender specified");
        const sql = `SELECT percentage FROM gender WHERE gender = ?`;
        return await this.getSingleRow(sql, [gender]);
    }

    async getHeightPercentage(minHeight = 0, maxHeight = 300, gender = 'total') {
        if (!['total', 'female', 'male'].includes(gender)) throw new Error("Invalid specified gender");
        if (minHeight < 0 || maxHeight > 300) throw new Error("Invalid height range");
        if (minHeight > maxHeight) throw new Error("minHeight must be less than or equal to maxHeight");
        if (minHeight > 190 || maxHeight < 149) throw new Error("Height range not supported");

        const genderColumn = gender + '_percent'; // todo rename column so i dont have to append percent every time

        let sql;
        if (gender === 'total') {
            sql = `SELECT SUM(female_percent + male_percent) / 2 FROM height WHERE height_low >= ? AND height_high <= ?`;
        } else {
            sql = `SELECT SUM(${genderColumn}) FROM height WHERE height_low >= ? AND height_high <= ?`;
        }
        return await this.getSingleRow(sql, [minHeight, maxHeight]);
    }

    async getIncomePercentage(minIncome, maxIncome) {
        if (minIncome > maxIncome) throw new Error("minIncome must be less than or equal to maxIncome");

        const sql = `SELECT SUM(population_percentage) FROM income WHERE income_low >= ? AND income_high <= ?`;
        return await this.getSingleRow(sql, [minIncome, maxIncome]);
    }

    async getWeightPercentage(minWeight, maxWeight, minAge = 18, maxAge = 100, gender = 'total') {
        if (!['total', 'Female', 'Male'].includes(gender)) throw new Error("Invalid gender specified");

        const possibleWeightCategories = ['underweight', 'normal', 'overweight', 'obese'];
        if (!possibleWeightCategories.includes(minWeight)) throw new Error("Invalid minWeight specified");
        if (!possibleWeightCategories.includes(maxWeight)) throw new Error("Invalid maxWeight specified");
        const minWeightIndex = possibleWeightCategories.indexOf(minWeight);
        const maxWeightIndex = possibleWeightCategories.indexOf(maxWeight);
        if (minWeightIndex > maxWeightIndex) {
            throw new Error("minWeight must be less than or equal to maxWeight");
        }

        const selectedWeights = possibleWeightCategories.slice(minWeightIndex, maxWeightIndex + 1);

        // for people below 18 years old there is no data
        // todo fill in
        // https://www.bundesgesundheitsministerium.de/themen/praevention/kindergesundheit/praevention-von-kinder-uebergewicht#:~:text=Ergebnisse%20der%20zweiten%20Welle%20der,5%2C9%20Prozent%20adip%C3%B6s%20sind.
        // https://www.rki.de/DE/Content/Gesundheitsmonitoring/Gesundheitsberichterstattung/GBEDownloadsJ/Journal-of-Health-Monitoring_01_2018_KiGGS-Welle2_erste_Ergebnisse.pdf?__blob=publicationFile

        let sql;
        if (gender === 'total') {
            // todo ausgiebig testen
            sql = `SELECT SUM(${selectedWeights.join(' + ')}) / ${selectedWeights.length} FROM weight WHERE age_lower >= ? AND age_upper <= ?`;
        } else {
            sql = `SELECT SUM(${selectedWeights.join(' + ')}) / ${selectedWeights.length} FROM weight WHERE age_lower >= ? AND age_upper <= ? AND gender = ?`;
        }
        return await this.getSingleRow(sql, [minAge, maxAge, gender]);
    }

    async getSinglesPercentage(minAge, maxAge) {
        if (minAge > maxAge) throw new Error("minAge must be less than or equal to maxAge");

        const sql = `SELECT SUM(singles_in_age_group) FROM singles WHERE age_lower >= ? AND age_upper <= ?`;
        return await this.getSingleRow(sql, [minAge, maxAge]);
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
}
