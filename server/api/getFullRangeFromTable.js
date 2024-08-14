import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const { tableName, columnMin, columnMax } = query;
    if (!tableName || !columnMin || !columnMax) {
        return { error: 'Missing required parameters: tableName, columnMin, columnMax' };
    }

    if (tableName === "weight") {
        return ["underweight", "normal", "overweight", "obese"];
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        let data = await dbc.getFullRangeFromTable(tableName, columnMin, columnMax);

        // Convert Infinity values to string, because Infinity is not a valid JSON
        data = data.map(value => (value === Infinity ? 'Infinity' : value === -Infinity ? '-Infinity' : value));

        return data; // here infinity still exists
    } catch (error) {
        return { error: error.message };
    }
});
