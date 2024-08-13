import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const { tableName, columnMin, columnMax } = query;
    if (!tableName || !columnMin || !columnMax) {
        return { error: 'Missing required parameters: tableName, columnMin, columnMax' };
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        const data = await dbc.getFullRangeFromTable(minHeight, maxHeight, gender);
        return { data };
    } catch (error) {
        return { error: error.message };
    }
});
