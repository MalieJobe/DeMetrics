import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const { gender } = query;

    if (!['female', 'male', 'total'].includes(gender)) {
        return { error: 'Invalid gender specified' };
    }
    if (gender === 'total') {
        return 1;
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        const data = await dbc.getGenderPercentage(gender);
        return { data };
    } catch (error) {
        return { error: error.message };
    }
});
