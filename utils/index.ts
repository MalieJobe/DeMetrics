const locale = 'en-US';

function formatNumber(value: number, unit: string) {
    let formatter;

    switch (unit) {
        case 'length':
            // Assuming length in meters and converting it to appropriate unit
            formatter = new Intl.NumberFormat(locale, {
                style: 'unit',
                unit: 'centimeter', // Default is meter
                unitDisplay: 'short', // Can be 'short' or 'narrow'
            });
            break;
        case 'currency':
            // Formatting as currency
            formatter = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'EUR', // Default currency is EUR
                minimumFractionDigits: 1,
            });
            break;
        case 'year':
            // Formatting as a year (integer)
            formatter = new Intl.NumberFormat(locale, {
                style: 'unit',
                unit: 'year',
            });
            break;
        default:
            throw new Error('Invalid unit type. Valid units are length, currency, and year.');
    }

    return formatter.format(value);
}

// Example Usage:
console.log(formatNumber(1500, 'length')); // "1,500 kilometers"
console.log(formatNumber(1000, 'currency')); // "€1,000.00"
console.log(formatNumber(2024, 'year')); // "2,024"
