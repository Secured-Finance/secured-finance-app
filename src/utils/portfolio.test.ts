import { BigNumber, utils } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { TradeHistory } from 'src/types';
import timemachine from 'timemachine';
import { CurrencySymbol } from './currencyList';
import {
    computeNetValue,
    computeWeightedAverageRate,
    calculateForwardValue,
    calculateAveragePrice,
    formatOrders,
    checkOrderIsFilled,
} from './portfolio';
import {
    dec22Fixture,
    ethBytes32,
    efilBytes32,
    wbtcBytes32,
} from 'src/stories/mocks/fixtures';

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
                averagePrice: BigNumber.from(9698),
                maturity: BigNumber.from(1675252800),
            },
            {
                amount: 9000,
                averagePrice: BigNumber.from(9674),
                maturity: BigNumber.from(1675252800),
            },
        ];
        expect(
            computeWeightedAverageRate(
                trades as unknown as TradeHistory
            ).toNumber()
        ).toEqual(196880);
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeWeightedAverageRate([]).toNumber()).toEqual(0);
    });
});

describe('computeNetValue', () => {
    const priceMap: AssetPriceMap = {
        [CurrencySymbol.ETH]: 1000,
        [CurrencySymbol.EFIL]: 6,
        [CurrencySymbol.USDC]: 1,
        [CurrencySymbol.WBTC]: 30000,
    };
    it('should return the net value', () => {
        const trades = [
            {
                amount: '1000000000000000000',
                currency: formatBytes32String(CurrencySymbol.ETH),
                side: 0,
            },
            {
                amount: '100000000000000000000',
                currency: formatBytes32String(CurrencySymbol.EFIL),
                side: 1,
            },
        ];
        expect(
            computeNetValue(trades as unknown as TradeHistory, priceMap)
        ).toEqual(400);
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeNetValue([], priceMap)).toEqual(0);
    });

    it('should return the net value of borrow and lend trades', () => {
        const trades = [
            {
                amount: '10000000000000000000',
                currency: formatBytes32String(CurrencySymbol.ETH),
                side: 1,
            },
            {
                amount: '1000000000000000000000',
                currency: formatBytes32String(CurrencySymbol.EFIL),
                side: 1,
            },
            {
                amount: '100000000',
                currency: formatBytes32String(CurrencySymbol.WBTC),
                side: 0,
            },
            {
                amount: '1000000000',
                currency: formatBytes32String(CurrencySymbol.USDC),
                side: 1,
            },
        ];
        expect(
            computeNetValue(
                trades.filter(
                    trade => trade.side === 1
                ) as unknown as TradeHistory,
                priceMap
            )
        ).toEqual(-17000);

        expect(
            computeNetValue(
                trades.filter(
                    trade => trade.side === 0
                ) as unknown as TradeHistory,
                priceMap
            )
        ).toEqual(30000);
    });
});

describe('formatOrders', () => {
    it('should return forward value', () => {
        expect(
            calculateForwardValue(BigNumber.from(900), BigNumber.from(9000))
        ).toEqual(BigNumber.from(1000));
    });

    it('should return average price', () => {
        expect(calculateAveragePrice(BigNumber.from(9000))).toEqual(0.9);
    });

    it('should format orders to trades', () => {
        const orders = [
            {
                orderId: BigNumber.from(1),
                currency: ethBytes32,
                side: 0,
                maturity: dec22Fixture.toString(),
                unitPrice: BigNumber.from('9000'),
                amount: BigNumber.from('900'),
                createdAt: BigNumber.from('1609295092'),
            },
            {
                orderId: BigNumber.from(2),
                currency: efilBytes32,
                side: 1,
                maturity: dec22Fixture.toString(),
                unitPrice: BigNumber.from('8000'),
                amount: BigNumber.from('10000'),
                createdAt: BigNumber.from('1609295092'),
            },
        ];
        const trades = [
            {
                amount: BigNumber.from('900'),
                side: 0,
                orderPrice: BigNumber.from('9000'),
                createdAt: BigNumber.from('1609295092'),
                currency: ethBytes32,
                maturity: dec22Fixture.toString(),
                forwardValue: BigNumber.from(1000),
                averagePrice: 0.9,
            },
            {
                amount: BigNumber.from('10000'),
                side: 1,
                orderPrice: BigNumber.from('8000'),
                createdAt: BigNumber.from('1609295092'),
                currency: efilBytes32,
                maturity: dec22Fixture.toString(),
                forwardValue: BigNumber.from(12500),
                averagePrice: 0.8,
            },
        ];

        expect(formatOrders(orders)).toEqual(trades);
    });
});

describe('checkOrderIsFilled', () => {
    const orders = [
        {
            orderId: BigNumber.from(1),
            currency: efilBytes32,
            side: 1,
            maturity: dec22Fixture.toString(),
            unitPrice: BigNumber.from('9800'),
            amount: BigNumber.from('1000000000000000000000'),
            createdAt: BigNumber.from('1609299000'),
        },
        {
            orderId: BigNumber.from(2),
            currency: efilBytes32,
            side: 1,
            maturity: dec22Fixture.toString(),
            unitPrice: BigNumber.from('9600'),
            amount: BigNumber.from('5000000000000000000000'),
            createdAt: BigNumber.from('1609298000'),
        },
        {
            orderId: BigNumber.from(3),
            currency: efilBytes32,
            side: 0,
            maturity: dec22Fixture.toString(),
            unitPrice: BigNumber.from('9800'),
            amount: BigNumber.from('1000000000'),
            createdAt: BigNumber.from('1609297000'),
        },
        {
            orderId: BigNumber.from(4),
            currency: wbtcBytes32,
            side: 1,
            maturity: dec22Fixture.toString(),
            unitPrice: BigNumber.from('9600'),
            amount: BigNumber.from('5000000000000000000000'),
            createdAt: BigNumber.from('1609296000'),
        },
        {
            orderId: BigNumber.from(5),
            currency: ethBytes32,
            side: 0,
            maturity: dec22Fixture.toString(),
            unitPrice: BigNumber.from('9800'),
            amount: BigNumber.from('1000000000'),
            createdAt: BigNumber.from('1609295000'),
        },
    ];
    it('should return true', () => {
        const order = {
            orderId: 5,
            currency: ethBytes32,
            side: 0,
            maturity: dec22Fixture,
            unitPrice: BigNumber.from('9800'),
            filledAmount: BigNumber.from('1000000000000000000000'),
            amount: BigNumber.from('1000000000000000000000'),
            status: 'Open' as const,
            createdAt: BigNumber.from('1'),
            txHash: utils.formatBytes32String('hash'),
        };

        expect(checkOrderIsFilled(order, orders)).toEqual(true);
    });

    it('should return false', () => {
        const order = {
            orderId: 6,
            currency: ethBytes32,
            side: 0,
            maturity: dec22Fixture,
            unitPrice: BigNumber.from('9800'),
            filledAmount: BigNumber.from('1000000000000000000000'),
            amount: BigNumber.from('1000000000000000000000'),
            status: 'Open' as const,
            createdAt: BigNumber.from('1'),
            txHash: utils.formatBytes32String('hash'),
        };

        expect(checkOrderIsFilled(order, orders)).toEqual(false);
    });
});
