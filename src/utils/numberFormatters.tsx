/* eslint-disable no-loop-func */
import uniq from 'lodash/uniq';
import { format } from 'd3-format';

const SI_SYMBOL = ['', 'K', 'M', 'B'];

const formatNumber = format(',');

const formatNumberToPrecision = (value: any = 0, precision = 0) =>
    formatNumber(parseFloat(parseFloat(value).toFixed(precision)));

const formatToCompactNumber = (value = 0, precision = 0) => {
    const tier = Math.min((Math.log10(Math.abs(value)) / 3) | 0, SI_SYMBOL.length - 1);
    if (tier === 0) {
        return value.toFixed().toString();
    }
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = value / scale;
    const isRounded = !(scaled % 1);
    return isRounded ? scaled.toFixed() + suffix : scaled.toFixed(precision) + suffix;
};
const formatToPercent = (value = 0) => {
    const formatedValue = typeof value === 'number' ? formatNumberToPrecision(value, 0) : value;

    return `${formatedValue}%`;
};

const countPercentageFromBase = (base: number, chunk = 0, precision?: number) => {
    if (chunk === 0 || base === 0) {
        return 0;
    }
    if (precision === undefined) {
        return (chunk * 100) / base;
    }
    // @ts-ignore
    // eslint-disable-next-line radix
    if (precision < 0 || !(precision === parseInt(precision, 10))) {
        throw new Error('Precision should be integer');
    }
    return Number(((chunk * 100) / base).toFixed(precision));
};

const calcPrecision = (values: number[], maxPrecision = 4) => {
    let precision = 0;
    while (precision < maxPrecision) {
        const compactValues = (values || []).map(v =>
            formatToCompactNumber(v, precision).toLocaleLowerCase()
        );

        if (compactValues.length === uniq(compactValues).length) {
            return precision;
        }
        precision += 1;
    }
};

export {
    formatNumberToPrecision,
    formatToCompactNumber,
    formatToPercent,
    countPercentageFromBase,
    calcPrecision
};
