import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    console.log(query)

    // Validate query parameters
    const minAge = parseInt(query.minAge);
    const maxAge = parseInt(query.maxAge);
    const gender = query.gender || 'total';

    console.log(minAge, maxAge, gender)

    if (isNaN(minAge) || isNaN(maxAge)) {
        return { error: 'Invalid parameters: ' + JSON.stringify(query) };
    }
    if (!['total', 'female', 'male'].includes(gender)) {
        return { error: 'Invalid parameters.' + JSON.stringify(query) };
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        const data = await dbc.getAgePercentage(minAge, maxAge, gender);
        return { data };
    } catch (error) {
        return { error: error.message };
    }
});
