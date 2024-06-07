import {
    formatToCompactNumber,
    formatToPercent,
    formatNumberToPrecision,
    countPercentageFromBase
} from './numberFormatters';

describe('formatToPercent', () => {
    it('returns string in proper format', () => {
        const number1 = 10;
        const number2 = 1000;
        expect(formatToPercent(number1)).to.eq('10%');
        expect(formatToPercent(number2)).to.eq('1,000%');
    });

    it('returns string in proper format for empty value', () => {
        const number = undefined;
        expect(formatToPercent(number)).to.eq('0%');
    });
});

describe('formatToCompactNumber', () => {
    it('return string in proper format for hundreds', () => {
        const number = 100;
        expect(formatToCompactNumber(number)).to.eq('100');
    });

    it('return string in proper format for thousands', () => {
        const number1 = 1400;
        const number2 = 1600;
        expect(formatToCompactNumber(number1)).to.eq('1K');
        expect(formatToCompactNumber(number2)).to.eq('2K');
    });

    it('return string in proper format for millions', () => {
        const number1 = 1400000;
        const number2 = 1600000;
        expect(formatToCompactNumber(number1)).to.eq('1M');
        expect(formatToCompactNumber(number2)).to.eq('2M');
    });

    it('return string in proper format for billions', () => {
        const number1 = 14e8;
        const number2 = 16e8;
        expect(formatToCompactNumber(number1)).to.eq('1B');
        expect(formatToCompactNumber(number2)).to.eq('2B');
    });

    it('return string in proper format for more then billions', () => {
        const number1 = 14e11;
        expect(formatToCompactNumber(number1)).to.eq('1400B');
    });

    it('return string in proper format for negative value', () => {
        const number = -10000;
        expect(formatToCompactNumber(number)).to.eq('-10K');
    });
});

describe('formatNumberToPrecision', () => {
    it('return string with required precision - double value', () => {
        const number = 12.3456789123456;
        expect(formatNumberToPrecision(number, 2)).to.eq('12.35');
    });
    it('return string with required precision - negative double value', () => {
        const number = -12.3456789123456;
        expect(formatNumberToPrecision(number, 2)).to.eq('−12.35');
    });
    it('return string with required precision - int value', () => {
        const number = 12;
        expect(formatNumberToPrecision(number, 2)).to.eq('12');
    });

    it('return string with default precision', () => {
        const number = 12.3456789123456;
        expect(formatNumberToPrecision(number)).to.eq('12');
    });
});

describe('countPercentageFromBase', () => {
    it('return 0 incase base is zero or chunk is zero', () => {
        expect(countPercentageFromBase(0)).to.eq(0);
        expect(countPercentageFromBase(100, 0)).to.eq(0);
    });

    it('return percentage value with no precision - in result', () => {
        expect(countPercentageFromBase(100, 20)).to.eq(20);
    });
    it('return percentage value with no precision - double result', () => {
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        expect(countPercentageFromBase(110, 20)).to.eq(18.181818181818182);
    });

    it('return percentage value with precision', () => {
        expect(countPercentageFromBase(110, 20, 0)).to.eq(18);
    });

    it('throw error incase precision is negative or not int', () => {
        expect(() => countPercentageFromBase(110, 20, 1.22)).to.throw('Precision should be integer');
        expect(() => countPercentageFromBase(110, 20, -1)).to.throw('Precision should be integer');
    });
});
