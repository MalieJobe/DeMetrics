import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const minAge = parseInt(query.minAge);
    const maxAge = parseInt(query.maxAge);
    const gender = query.gender || 'total';

    if (isNaN(minAge) || isNaN(maxAge) || !['total', 'female', 'male'].includes(gender)) {
        return { error: 'Invalid parameters. Ages must be Number. Gender must be String.' };
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
