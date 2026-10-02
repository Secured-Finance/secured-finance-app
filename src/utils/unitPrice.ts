const UNIT_PRICE_SCALE = 100;

export const DEFAULT_ORDER_UNIT_PRICE_RANGE = {
    min: 1,
    max: 10000,
} as const;

export const toUnitPrice = (price: number): number =>
    Math.round(price * UNIT_PRICE_SCALE);

export const fromUnitPrice = (unitPrice: number | bigint): number =>
    Number(unitPrice) / UNIT_PRICE_SCALE;

export const formatUnitPrice = (unitPrice: number | bigint): string =>
    fromUnitPrice(unitPrice)
        .toFixed(2)
        .replace(/\.?0+$/, '');
