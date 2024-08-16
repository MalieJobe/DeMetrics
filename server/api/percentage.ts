import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    try {
        const queryParameters = getQuery(event);

        const validParameterKeys = [
            'minAge', 'maxAge', 'minHeight', 'maxHeight',
            'minWeight', 'maxWeight', 'minIncome', 'maxIncome',
            'gender', 'isSingle',
        ] as const;

        // Define the TypeScript type using the keys
        type ValidParameters = {
            [key in typeof validParameterKeys[number]]?: number | 'total' | 'male' | 'female';
        };

        // Initialize the valid parameters object
        const validParameters: ValidParameters = {};

        validParameterKeys.forEach(key => {
            // Check if the query parameter is defined
            if (queryParameters[key] !== undefined) {
                if (key === 'gender') validParameters[key] = queryParameters[key] as 'total' | 'male' | 'female';
                else validParameters[key] = queryParameters[key] as number
            }
        });

        // Check if there are no valid parameters
        if (Object.keys(validParameters).length === 0) {
            setResponseStatus(event, 200);
            return {
                data: 1,
                status: `No matching query parameters were found.Valid parameters are ${validParameterKeys.join(', ')}. Returning 1.`
            };
        }


        const dbFilePath = './server/data/demographics.sqlite';
        const dbc = await DBConnector.getInstance(dbFilePath);

        let totalPercentage: number = 1;

        /**
         * If age is not used in any of the parameters, calculate the percentage for age alone.
         * Does not go for income, as it is not take age into account.
         */
        const allThatUseAge = ['minHeight', 'maxHeight', 'minWeight', 'maxWeight', 'isSingle'];

        if (!Object.keys(validParameters).some(key => allThatUseAge.includes(key))) {
            if (validParameters.minAge || validParameters.maxAge) {
                const args = [validParameters.minAge, validParameters.maxAge, validParameters.gender];
                const p_age = await dbc.getAgePercentage(...args);
                totalPercentage *= p_age;
            }
        }

        if (validParameters.minHeight || validParameters.maxHeight) {
            const args = [validParameters.minHeight, validParameters.maxHeight, validParameters.gender];
            const p_height = await dbc.getHeightPercentage(...args);
            totalPercentage *= p_height;
        }

        if (validParameters.minIncome || validParameters.maxIncome) {
            const args = [validParameters.minIncome, validParameters.maxIncome];
            const p_income = await dbc.getIncomePercentage(...args);
            totalPercentage *= p_income;
        }

        if (validParameters.minWeight || validParameters.maxWeight) {
            const args = [validParameters.minWeight, validParameters.maxWeight, validParameters.minAge, validParameters.maxAge, validParameters.gender];
            const p_weight = await dbc.getWeightPercentage(...args);
            totalPercentage *= p_weight;
        }

        if (validParameters.isSingle === true) {
            const args = [validParameters.minAge, validParameters.maxAge];
            const p_single = await dbc.getSinglePercentage(...args);
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
