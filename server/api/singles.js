import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const minAge = parseInt(query.minAge) || 18;
    const maxAge = parseInt(query.maxAge) || 100;

    if (isNaN(minAge) || isNaN(maxAge) || minAge > maxAge) {
        return { error: 'Invalid parameters. Age must be Numbers.' };
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        const data = await dbc.getSinglesPercentage(minAge, maxAge);
        return { data };
    } catch (error) {
        return { error: error.message };
    }
});
