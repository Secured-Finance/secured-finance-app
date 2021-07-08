export const daysInYear = [90, 180, 360, 720, 1080, 1800];
export const MIN_COVERAGE = 150;

export const calculatePercents = (
    a: number,
    b: number,
    toFixed: number = 0
) => {
    if (a === 0 || b === 0) return 0;
    return ((a / b) * 100).toFixed(toFixed);
};

export const getSmartFormattedNumber = (num: number) => {
    const res = Math.floor(num * 100) / 100;

    const stringNumber = String(res);
    const numberArray = stringNumber.split(',');
    if (numberArray[1] == '00') return numberArray[0];

    return res;
};
