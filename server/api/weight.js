import DBConnector from "../DBConnector";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Validate query parameters
    const { minWeight, maxWeight, minAge, maxAge, gender } = query;
    const allowedWeights = ['underweight', 'normal', 'overweight', 'obese'];
    if (!minAge) minAge = 18;
    if (!maxAge) maxAge = 100;
    if (!gender) gender = 'total';

    if (!allowedWeights.includes(minWeight) ||
        !allowedWeights.includes(maxWeight) ||
        parseInt(minAge) > parseInt(maxAge) ||
        !['all', 'female', 'male'].includes(gender)) {
        return {
            error: 'Invalid parameters. Weights must be one of ' + allowedWeights.join(', ')
                + '. Age (optional) must be Numbers. Gender (optional) must be String.'
        };
    }

    const dbFilePath = './server/data/demographics.sqlite';
    const dbc = await DBConnector.getInstance(dbFilePath);

    try {
        const data = await dbc.getWeightPercentage(minWeight, maxWeight, parseInt(minAge), parseInt(maxAge), gender);
        return { data };
    } catch (error) {
        return { error: error.message };
    }
});
