import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    try {
        const queryParameters = getQuery(event);

        const weightOptions = ['schlank', 'durchnittlich', 'kurvig', 'mehrgewichtig'];
        const genderOptions = ['total', 'male', 'female'];
        const parameterSchema = {
            minAge: "number", maxAge: "number",
            minHeight: "number", maxHeight: "number",
            minWeight: weightOptions, maxWeight: weightOptions,
            minIncome: "number", maxIncome: "number",
            gender: genderOptions, isSingle: "boolean",
        };
        const validParameters = {};

        for (const [key, type] of Object.entries(parameterSchema)) {
            if (queryParameters[key] !== undefined && queryParameters[key] !== null) {
                if (type === "number") {
                    validParameters[key] = parseFloat(queryParameters[key]);
                }
                else if (type === "boolean") {
                    validParameters[key] = queryParameters[key] === "true"; // Convert string to boolean
                }
                else if (Array.isArray(type)) {
                    if (type.includes(queryParameters[key])) {
                        validParameters[key] = queryParameters[key];
                    }
                    else {
                        setResponseStatus(event, 400);
                        return { error: `Invalid value for query parameter ${key}. Expected one of ${type.join(", ")}.` };
                    }
                }
            }
        }

        // Default to returning 1 if no valid parameters are found
        if (Object.keys(validParameters).length === 0) {
            setResponseStatus(event, 200);
            return { data: 1, status: `No matching query parameters were found. Returning 1.` };
        }

        // replace weight values with english names for the database
        for (const key in validParameters) {
            if (key === 'minWeight' || key === 'maxWeight') {
                validParameters[key] = validParameters[key].replace('schlank', 'underweight')
                    .replace('durchnittlich', 'normal')
                    .replace('kurvig', 'overweight')
                    .replace('mehrgewichtig', 'obese');
            }
        }

        const dbFilePath = './server/data/demographics.sqlite';
        const dbc = await DBConnector.getInstance(dbFilePath);

        let totalPercentage = 1;
        let totalSinglePercentage = 1;
        let totalOfSelectedGender = 1;

        console.log(validParameters)

        // Query database using Vercel Postgres based on parameters
        if (validParameters.minAge || validParameters.maxAge) {
            const { minAge = 14, maxAge = 100, gender = 'total' } = validParameters;
            const sql = `SELECT SUM(${gender})  AS percentage FROM age WHERE age_min >= ? AND age_max <= ?`;
            const res =  await dbc.getSingleValues(sql, [minAge, maxAge]);
            console.log("Age", res)
            const p_age = Math.min(res, 1)
            totalPercentage *= p_age;
            totalSinglePercentage *= p_age;
            totalOfSelectedGender *= p_age;
        }

        if (validParameters.minHeight || validParameters.maxHeight) {
            const { minHeight = 0, maxHeight = 300, gender = 'total' } = validParameters;

            const sql = gender === 'total'
                ? `SELECT SUM(female + male) / 2 AS percentage FROM height WHERE height_min <= ? AND height_max >= ?`
                : `SELECT SUM(${gender}) AS percentage FROM height WHERE height_min <= ? AND height_max >= ?`;
            const res = await dbc.getSingleValues(sql, [maxHeight, minHeight]);
            console.log("height", res)
            const p_height = Math.min(res, 1);
            totalPercentage *= p_height;
            totalSinglePercentage *= p_height;
            totalOfSelectedGender *= p_height;
        }

        if (validParameters.minIncome || validParameters.maxIncome) {
            const { minIncome = `'-Infinity'`, maxIncome = `'Infinity'` } = validParameters;
            const sql = `SELECT SUM(percent) AS percentage FROM income WHERE income_min <= ? AND income_max >= ?`;
            const res = await dbc.getSingleValues(sql, [maxIncome, minIncome]);
            console.log("income", res)
            const p_income = Math.min(res, 1);
            totalPercentage *= p_income;
            totalSinglePercentage *= p_income;
            totalOfSelectedGender *= p_income;
        }

        if (validParameters.minWeight || validParameters.maxWeight) {
            const { minWeight = 'underweight', maxWeight = 'obese', minAge = 18, maxAge = 100, gender = 'total' } = validParameters;
            const weightCategories = ['underweight', 'normal', 'overweight', 'obese'];
            const selectedWeights = weightCategories.slice(
                weightCategories.indexOf(minWeight),
                weightCategories.indexOf(maxWeight) + 1
            );

            const sql = gender === 'total'
            ? `SELECT SUM(${selectedWeights.join(' + ')}) / COUNT(${selectedWeights[0]}) AS percentage FROM weight WHERE age_max >= ? AND age_min <= ?`
            : `SELECT SUM(${selectedWeights.join(' + ')}) / COUNT(${selectedWeights[0]}) AS percentage FROM weight WHERE age_max >= ? AND age_min <= ? AND gender = ?`;
            const params = gender === 'total' ? [minAge, maxAge] : [minAge, maxAge, gender];
            const res = await dbc.getSingleValues(sql, params);
            console.log("weight", res)
            const p_weight = Math.min(res, 1);
            totalPercentage *= p_weight;
            totalSinglePercentage *= p_weight;
            totalOfSelectedGender *= p_weight;
        }

        if (validParameters.gender) {
            const { gender = 'total' } = validParameters;
            const sql = `SELECT percentage FROM gender WHERE gender = ?`;
            const res = await dbc.getSingleValues(sql, [gender]);
            console.log("gender", res)
            const p_gender = Math.min(res, 1);
            totalPercentage *= p_gender;
            totalSinglePercentage *= p_gender;
        }

        setResponseStatus(event, 200);
        return {
            data: { totalPercentage, totalSinglePercentage, totalOfSelectedGender },
            status: "Success"
        };
    } catch (error) {
        setResponseStatus(event, 500);
        return { error: error.stack };
    }
});
