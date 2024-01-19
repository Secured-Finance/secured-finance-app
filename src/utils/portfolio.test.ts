import { toBytes32 } from '@secured-finance/sf-graph-client';
import {
    dec22Fixture,
    ethBytes32,
    orderHistoryList,
    wbtcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { OrderType, TradeHistory } from 'src/types';
import timemachine from 'timemachine';
import { createCurrencyMap } from './currencyList';
import {
    calculateAveragePrice,
    calculateForwardValue,
    checkOrderIsFilled,
    computeNetValue,
    computeWeightedAverageRate,
    formatOrders,
    getMaxAmount,
    sortOrders,
} from './portfolio';

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-01T11:00:00.00Z',
    });
});

describe('computeWeightedAverage', () => {
    it('should return the weighted average', () => {
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() =>
            new Date('2022-12-01T11:00:00.00Z').valueOf()
        );
        const trades = [
            {
                amount: 1000,
                averagePrice: BigInt(9698),
                maturity: BigInt(1675252800),
            },
            {
                amount: 9000,
                averagePrice: BigInt(9674),
                maturity: BigInt(1675252800),
            },
        ];
        expect(
            computeWeightedAverageRate(
                trades as unknown as TradeHistory
            ).toNumber()
        ).toEqual(196748);
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeWeightedAverageRate([]).toNumber()).toEqual(0);
    });
});

describe('computeNetValue', () => {
    const priceMap = createCurrencyMap<number>(0);
    priceMap.ETH = 1000;
    priceMap.WFIL = 6;
    priceMap.USDC = 1;
    priceMap.WBTC = 30000;
    priceMap.aUSDC = 1;
    priceMap.axlFIL = 1;

    it('should return the net value', () => {
        const positions = [
            {
                amount: BigInt('400000000000000000000'),
                currency: wfilBytes32,
                forwardValue: BigInt('500000000000000000000'),
                maturity: dec22Fixture.toString(),
                marketPrice: BigInt(8000),
            },
            {
                amount: BigInt('-500000000000000000000'),
                currency: wfilBytes32,
                forwardValue: BigInt('-1000000000000000000000'),
                maturity: dec22Fixture.toString(),
                marketPrice: BigInt(5000),
            },
        ];
        expect(computeNetValue(positions, priceMap)).toEqual(-600);
    });

    it('should return 0 if no positions are provided', () => {
        expect(computeNetValue([], priceMap)).toEqual(0);
    });

    it('should return the net value of borrow and lend positions', () => {
        const positions = [
            {
                amount: BigInt('400000000000000000000'),
                currency: wfilBytes32,
                forwardValue: BigInt('500000000000000000000'),
                maturity: dec22Fixture.toString(),
                marketPrice: BigInt(8000),
            },
            {
                amount: BigInt('-500000000000000000000'),
                currency: wfilBytes32,
                forwardValue: BigInt('-1000000000000000000000'),
                maturity: dec22Fixture.toString(),
                marketPrice: BigInt(5000),
            },
            {
                amount: BigInt('-500000000'),
                forwardValue: BigInt('-1000000000'),
                currency: wbtcBytes32,
                maturity: dec22Fixture.toString(),
                marketPrice: BigInt(50),
            },
            {
                amount: BigInt('505000000'),
                forwardValue: BigInt('505000000'),
                currency: wbtcBytes32,
                maturity: dec22Fixture.toString(),
                marketPrice: BigInt(100),
            },
        ];
        expect(
            computeNetValue(
                positions.filter(position => position.forwardValue < 0),
                priceMap
            )
        ).toEqual(-153000);

        expect(
            computeNetValue(
                positions.filter(position => position.forwardValue > 0),
                priceMap
            )
        ).toEqual(153900);
    });
});

describe('formatOrders', () => {
    it('should return forward value', () => {
        expect(calculateForwardValue(BigInt(900), BigInt(9000))).toEqual(
            BigInt(1000)
        );
    });

    it('should return average price', () => {
        expect(calculateAveragePrice(BigInt(9000))).toEqual(0.9);
    });

    it('should format orders to trades', () => {
        const orders = [
            {
                orderId: BigInt(1),
                currency: ethBytes32,
                side: 0,
                maturity: dec22Fixture.toString(),
                unitPrice: BigInt('9000'),
                amount: BigInt('900'),
                createdAt: BigInt('1609295092'),
                maker: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
            },
            {
                orderId: BigInt(2),
                currency: wfilBytes32,
                side: 1,
                maturity: dec22Fixture.toString(),
                unitPrice: BigInt('8000'),
                amount: BigInt('10000'),
                createdAt: BigInt('1609295092'),
            },
        ];
        const trades = [
            {
                amount: BigInt('900'),
                side: 0,
                orderPrice: BigInt('9000'),
                createdAt: BigInt('1609295092'),
                currency: ethBytes32,
                maturity: dec22Fixture.toString(),
                forwardValue: BigInt(1000),
                averagePrice: 0.9,
                feeInFV: BigInt(0),
                taker: { id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D' },
            },
            {
                amount: BigInt('10000'),
                side: 1,
                orderPrice: BigInt('8000'),
                createdAt: BigInt('1609295092'),
                currency: wfilBytes32,
                maturity: dec22Fixture.toString(),
                forwardValue: BigInt(12500),
                averagePrice: 0.8,
                feeInFV: BigInt(0),
                taker: { id: '' },
            },
        ];

        expect(formatOrders(orders)).toEqual(trades);
    });
});

describe('checkOrderIsFilled', () => {
    const orders = [
        {
            orderId: BigInt(1),
            currency: wfilBytes32,
            side: 1,
            maturity: dec22Fixture.toString(),
            unitPrice: BigInt('9800'),
            amount: BigInt('1000000000000000000000'),
            createdAt: BigInt('1609299000'),
        },
        {
            orderId: BigInt(2),
            currency: wfilBytes32,
            side: 1,
            maturity: dec22Fixture.toString(),
            unitPrice: BigInt('9600'),
            amount: BigInt('5000000000000000000000'),
            createdAt: BigInt('1609298000'),
        },
        {
            orderId: BigInt(3),
            currency: wfilBytes32,
            side: 0,
            maturity: dec22Fixture.toString(),
            unitPrice: BigInt('9800'),
            amount: BigInt('1000000000'),
            createdAt: BigInt('1609297000'),
        },
        {
            orderId: BigInt(4),
            currency: wbtcBytes32,
            side: 1,
            maturity: dec22Fixture.toString(),
            unitPrice: BigInt('9600'),
            amount: BigInt('5000000000000000000000'),
            createdAt: BigInt('1609296000'),
        },
        {
            orderId: BigInt(5),
            currency: ethBytes32,
            side: 0,
            maturity: dec22Fixture.toString(),
            unitPrice: BigInt('9800'),
            amount: BigInt('1000000000'),
            createdAt: BigInt('1609295000'),
        },
    ];
    it('should return true', () => {
        const order = {
            orderId: 5,
            currency: ethBytes32,
            side: 0,
            maturity: dec22Fixture,
            inputUnitPrice: BigInt('9800'),
            filledAmount: BigInt('1000000000000000000000'),
            inputAmount: BigInt('1000000000000000000000'),
            status: 'Open' as const,
            type: OrderType.LIMIT,
            createdAt: BigInt('1'),
            txHash: toBytes32('hash'),
            lendingMarket: {
                id: '1',
                isActive: true,
            },
            maker: {
                id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
            },
        };

        expect(checkOrderIsFilled(order, orders)).toEqual(true);
    });

    it('should return false', () => {
        const order = {
            orderId: 6,
            currency: ethBytes32,
            side: 0,
            maturity: dec22Fixture,
            inputUnitPrice: BigInt('9800'),
            filledAmount: BigInt('1000000000000000000000'),
            inputAmount: BigInt('1000000000000000000000'),
            status: 'Open' as const,
            type: OrderType.LIMIT,
            createdAt: BigInt('1'),
            txHash: toBytes32('hash'),
            lendingMarket: {
                id: '1',
                isActive: true,
            },
            maker: {
                id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
            },
        };

        expect(checkOrderIsFilled(order, orders)).toEqual(false);
    });
});

describe('sortOrders', () => {
    const sortedOrders = orderHistoryList.sort((a, b) => sortOrders(a, b));

    for (let i = 0; i < sortedOrders.length - 1; i++) {
        expect(
            sortedOrders[i].createdAt >= sortedOrders[i + 1].createdAt
        ).toBeTruthy();
    }
});

describe('getMaxAmount', () => {
    it('returns the maximum amount from an array of orders', () => {
        const orders = [
            { amount: BigInt(10) },
            { amount: BigInt(5) },
            { amount: BigInt(20) },
        ];
        const maxAmount = getMaxAmount(orders);
        expect(maxAmount.toString()).toBe('20');
    });

    it('returns the amount of the only order in the array', () => {
        const orders = [{ amount: BigInt(10) }];
        const maxAmount = getMaxAmount(orders);
        expect(maxAmount.toString()).toBe('10');
    });

    it('returns zero if the array is empty', () => {
        const orders: { amount: bigint }[] = [];
        const maxAmount = getMaxAmount(orders);
        expect(maxAmount.toString()).toBe('0');
    });
});
