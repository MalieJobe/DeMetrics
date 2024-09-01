import DBConnector from "../DBConnector";
// todo: this needs hardcore improvement. used typescript, still get type issues in prod :/
export default defineEventHandler(async (event) => {
    try {
        const queryParameters = getQuery(event);
        console.log('Raw query parameters:', queryParameters);

        // Define the TypeScript type using the keys
        type ValidParameters = {
            minAge?: number, maxAge?: number,
            minHeight?: number, maxHeight?: number,
            minWeight?: 'underweight' | 'normal' | 'overweight' | 'obese', maxWeight?: 'underweight' | 'normal' | 'overweight' | 'obese',
            minIncome?: number, maxIncome?: number,
            gender?: 'total' | 'male' | 'female', isSingle?: Boolean;
        };

        const validParameterTypes = {
            minAge: 'number', maxAge: 'number',
            minHeight: 'number', maxHeight: 'number',
            minWeight: ['underweight', 'normal', 'overweight', 'obese'], maxWeight: ['underweight', 'normal', 'overweight', 'obese'],
            minIncome: 'number', maxIncome: 'number',
            gender: ['total', 'male', 'female'], isSingle: 'boolean',
        };

        // Initialize the valid parameters object
        const validParameters: ValidParameters = {};

        for (const [key, type] of Object.entries(validParameterTypes)) {
            // Check if the query parameter is defined
            if (queryParameters[key] !== undefined && queryParameters[key] !== null) {
                // before running typeof, using unary operator to convert to number if possible https://stackoverflow.com/a/594862
                if (type === 'number' && typeof +queryParameters[key] === type) validParameters[key] = +queryParameters[key];
                else if (type === 'boolean') validParameters[key] = queryParameters[key] === 'true';
                else if (validParameterTypes[key].includes(queryParameters[key])) validParameters[key] = queryParameters[key];
                else {
                    setResponseStatus(event, 400);
                    return {
                        error: `Invalid type for query parameter ${key}. Expected ${type}.`
                    };
                }
            }
        }
        console.log('Valid query parameters:', validParameters);

        // Check if there are no valid parameters
        if (Object.keys(validParameters).length === 0) {
            setResponseStatus(event, 200);
            return {
                data: 1,
                status: `No matching query parameters were found.Valid parameters are ${Object.keys(validParameterTypes).join(', ')}. Returning 1.`
            };
        }


        const dbFilePath = './server/data/demographics.sqlite';
        const dbc = await DBConnector.getInstance(dbFilePath);

        let totalPercentage: number = 1;
        let totalSinglePercentage: number = 1;
        let totalOfSelectedGender: number = 1;

        console.log('Database is set up. Percentage set to 1.')


        if (validParameters.minAge || validParameters.maxAge) {
            console.log('Age is requested. Getting percentage.');
            const args = [validParameters.minAge, validParameters.maxAge, validParameters.gender];
            const p_age = await dbc.getAgePercentage(...args);
            console.log('Age percentage:', p_age);
            totalPercentage *= p_age;
            totalSinglePercentage *= p_age;
            totalOfSelectedGender *= p_age;
        }

        if (validParameters.minHeight || validParameters.maxHeight) {
            console.log('Height is requested. Getting percentage.');
            const args = [validParameters.minHeight, validParameters.maxHeight, validParameters.gender];
            const p_height = await dbc.getHeightPercentage(...args);
            console.log('Height percentage:', p_height);
            totalPercentage *= p_height;
            totalSinglePercentage *= p_height;
            totalOfSelectedGender *= p_height;
        }

        if (validParameters.minIncome || validParameters.maxIncome) {
            console.log('Income is requested. Getting percentage.');
            const args = [validParameters.minIncome, validParameters.maxIncome];
            const p_income = await dbc.getIncomePercentage(...args);
            console.log('Income percentage:', p_income);
            totalPercentage *= p_income;
            totalSinglePercentage *= p_income;
            totalOfSelectedGender *= p_income;
        }

        if (validParameters.minWeight || validParameters.maxWeight) {
            console.log('Weight is requested. Getting percentage.');
            const args = [validParameters.minWeight, validParameters.maxWeight, validParameters.minAge, validParameters.maxAge, validParameters.gender];
            const p_weight = await dbc.getWeightPercentage(...args);
            console.log('Weight percentage:', p_weight);
            totalPercentage *= p_weight;
            totalSinglePercentage *= p_weight;
            totalOfSelectedGender *= p_weight;
        }

        if (validParameters.isSingle === true) {
            console.log('Single is requested. Getting percentage.');
            const args = [validParameters.minAge, validParameters.maxAge];
            const p_single = await dbc.getSinglesPercentage(...args);
            console.log('Single percentage:', p_single);
            totalPercentage *= p_single;
            totalOfSelectedGender *= p_single;
        }

        if (validParameters.gender) {
            console.log('gender requested. Getting percentage.');
            const args = [validParameters.gender];
            const p_gender = await dbc.getGenderPercentage(...args);
            console.log('Gender percentage:', p_gender);
            totalPercentage *= p_gender;
            totalSinglePercentage *= p_gender;
        }

        setResponseStatus(event, 200);
        return {
            data: {
                totalPercentage,
                totalSinglePercentage,
                totalOfSelectedGender,
            },
            status: "Success"
        };


    } catch (error) {
        setResponseStatus(event, 500);
        return { error: (error as Error).message };
    }
});
