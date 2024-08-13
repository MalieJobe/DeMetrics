import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const minHeight = parseInt(query.minHeight);
    const maxHeight = parseInt(query.maxHeight);
    const gender = query.gender || 'total';

    if (isNaN(minHeight) || isNaN(maxHeight) || !['total', 'female', 'male'].includes(gender)) {
        return { error: 'Invalid parameters. Heights must be Numbers. Gender (optional) must be String.' };
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        const data = await dbc.getHeightPercentage(minHeight, maxHeight, gender);
        return { data };
    } catch (error) {
        return { error: error.message };
    }
});
