// import DBConnector from '../DBConnector';

// export default async (req, res) => {
//     try {
//         const dbc = await DBConnector.getInstance('/C:/Users/malie/dev/DeMetrics/server/data/demographics.sqlite');
//         const ageData = await dbc.getAgePercentage(20, 23, 'female');
//         res.status(200).json(ageData);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    // Example: Get data based on query parameters
    if (query.type === 'age') {
        const { minAge, maxAge, gender } = query;
        return await dbc.getAgePercentage(parseInt(minAge), parseInt(maxAge), gender);
    } else if (query.type === 'height') {
        const { minHeight, maxHeight, gender } = query;
        return await dbc.getHeightPercentage(parseInt(minHeight), parseInt(maxHeight), gender);
    }
    // Add more conditions to handle different queries
    return { error: 'Invalid request' };
});
