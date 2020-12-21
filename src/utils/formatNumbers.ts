export const usdFormat = (number: number) => {
    return Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD', currencySign: 'accounting', maximumFractionDigits: 2 }).format(number)
}

export const percentFormat = (number: number, dividedBy: number = 100) => {
    return Intl.NumberFormat('en-US', { style: "percent", maximumFractionDigits: 2 }).format(number/dividedBy)
}

export const ordinaryFormat = (number: number) => {
    return Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number)
}