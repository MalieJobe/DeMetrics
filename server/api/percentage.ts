import DBConnector from "../DBConnector";
// todo: this needs hardcore improvement. used typescript, still get type issues in prod :/
export default defineEventHandler(async (event) => {
    try {
        const queryParameters = getQuery(event);
        console.log('Raw query parameters:', queryParameters);
        // const validParameterKeys = [
        //     'minAge', 'maxAge', 'minHeight', 'maxHeight',
        //     'minWeight', 'maxWeight', 'minIncome', 'maxIncome',
        //     'gender', 'isSingle',
        // ] as const;

        // Define the TypeScript type using the keys
        type ValidParameters = {
            minAge?: number, maxAge?: number,
            minHeight?: number, maxHeight?: number,
            minWeight?: number, maxWeight?: number,
            minIncome?: number, maxIncome?: number,
            gender?: 'total' | 'male' | 'female', isSingle?: Boolean;
        };

        const validParameterTypes = {
            minAge: 'number', maxAge: 'number',
            minHeight: 'number', maxHeight: 'number',
            minWeight: 'number', maxWeight: 'number',
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

        console.log('Database is set up. Percentage set to 1.')

        /**
         * If age is not used in any of the parameters, calculate the percentage for age alone.
         * Does not go for income, as it is not take age into account.
         */
        const allThatUseAge = ['minHeight', 'maxHeight', 'minWeight', 'maxWeight', 'isSingle'];

        if (!Object.keys(validParameters).some(key => {
            if (key === 'isSingle' && validParameters[key] === false) return false;
            return allThatUseAge.includes(key);
        })) {
            console.log('No parameter is using Age.');
            if (validParameters.minAge || validParameters.maxAge) {
                console.log('Age is requested. Getting percentage.');
                const args = [validParameters.minAge, validParameters.maxAge, validParameters.gender];
                const p_age = await dbc.getAgePercentage(...args);
                totalPercentage *= p_age;
            }
        } else { console.log('Age is used in other parameters.'); }

        if (validParameters.minHeight || validParameters.maxHeight) {
            console.log('Height is requested. Getting percentage.');
            const args = [validParameters.minHeight, validParameters.maxHeight, validParameters.gender];
            const p_height = await dbc.getHeightPercentage(...args);
            totalPercentage *= p_height;
        }

        if (validParameters.minIncome || validParameters.maxIncome) {
            console.log('Income is requested. Getting percentage.');
            const args = [validParameters.minIncome, validParameters.maxIncome];
            const p_income = await dbc.getIncomePercentage(...args);
            totalPercentage *= p_income;
        }

        if (validParameters.minWeight || validParameters.maxWeight) {
            console.log('Weight is requested. Getting percentage.');
            const args = [validParameters.minWeight, validParameters.maxWeight, validParameters.minAge, validParameters.maxAge, validParameters.gender];
            const p_weight = await dbc.getWeightPercentage(...args);
            totalPercentage *= p_weight;
        }

        if (validParameters.isSingle === true) {
            console.log('Single is requested. Getting percentage.');
            const args = [validParameters.minAge, validParameters.maxAge];
            const p_single = await dbc.getSinglesPercentage(...args);
            totalPercentage *= p_single;
        }

        setResponseStatus(event, 200);
        return {
            data: totalPercentage,
            status: "Success"
        };


    } catch (error) {
        setResponseStatus(event, 500);
        return { error: (error as Error).message };
    }
});
