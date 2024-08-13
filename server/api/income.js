import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const minIncome = parseInt(query.minIncome);
    const maxIncome = parseInt(query.maxIncome);

    if (isNaN(minIncome) || isNaN(maxIncome) || minIncome > maxIncome) {
        return { error: 'Invalid parameters. Income must be numbers. Max must be larger than Min.' };
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        const data = await dbc.getIncomePercentage(minIncome, maxIncome);
        return { data };
    } catch (error) {
        return { error: error.message };
    }
});
