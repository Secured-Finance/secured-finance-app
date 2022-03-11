export const usdFormat = (number: number, digits: number = 0) => {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting',
        maximumFractionDigits: digits,
    }).format(number);
};

export const percentFormat = (number: any, dividedBy: number = 100) => {
    return number !== 0
        ? Intl.NumberFormat('en-US', {
              style: 'percent',
              maximumFractionDigits: 2,
          }).format(number / dividedBy)
        : '0 %';
};

export const ordinaryFormat = (number: any, decimals: number = 2) => {
    return Intl.NumberFormat('en-US', {
        maximumFractionDigits: decimals,
    }).format(number);
};

export const formatInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let checkIfNum;
    if (e.key !== undefined) {
        checkIfNum =
            e.key === 'e' || e.key === '.' || e.key === '+' || e.key === '-';
    }
    return checkIfNum && e.preventDefault();
};
