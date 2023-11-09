import { Currency, Token } from '@secured-finance/sf-core';
import * as jest from 'jest-mock';
import {
    CurrencySymbol,
    ZERO_BI,
    currencyMap,
    hexToCurrencySymbol,
} from 'src/utils';
import {
    collateralBook37,
    dec22Fixture,
    dec24Fixture,
    ethBytes32,
    jun23Fixture,
    mar23Fixture,
    maturitiesMockFromContract,
    usdcBytes32,
    wbtcBytes32,
    wfilBytes32,
} from './fixtures';

function generateOrderbook(depth: number) {
    const unitPrices = [
        BigInt(9690),
        BigInt(9687),
        BigInt(9685),
        BigInt(9679),
        BigInt(9674),
    ];

    const zeros = Array(depth - unitPrices.length).fill(BigInt(0));

    const amounts = [
        BigInt('43000000000000000000000'),
        BigInt('23000000000000000000000'),
        BigInt('15000000000000000000000'),
        BigInt('12000000000000000000000'),
        BigInt('1800000000000000000000'),
    ];

    const quantities = [
        BigInt('1000'),
        BigInt('2000'),
        BigInt('3000'),
        BigInt('4000'),
        BigInt('5000'),
    ];

    return {
        unitPrices: [...unitPrices, ...zeros],
        amounts: [...amounts, ...zeros],
        quantities: [...quantities, ...zeros],
    };
}

function generateSimpleOrders(
    maturity: number,
    currency: string,
    isPreOrder: boolean,
    count: number
) {
    return Array(count)
        .fill(0)
        .map((_, i) => ({
            orderId: i,
            ccy: currency,
            side: 0,
            maturity: BigInt(maturity),
            unitPrice: BigInt('9800'),
            amount: BigInt('1000000000000000000'),
            timestamp: BigInt('1609210000'),
            isPreOrder: isPreOrder,
        }));
}

export const mockUseSF = () => {
    const mockSecuredFinance = {
        config: {
            network: 'sepolia',
        },
        placeOrder: jest.fn(),
        placePreOrder: jest.fn(),
        getBorrowUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigInt(9687),
                BigInt(9685),
                BigInt(9679),
                BigInt(9674),
                BigInt(9653),
                BigInt(9643),
                BigInt(9627),
                BigInt(9617),
            ])
        ),
        getLendUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigInt(9685),
                BigInt(9683),
                BigInt(9677),
                BigInt(9672),
                BigInt(9651),
                BigInt(9641),
                BigInt(9625),
                BigInt(9615),
            ])
        ),
        getMidUnitPrices: jest
            .fn<Promise<bigint[]>, Currency[]>()
            .mockImplementation((ccy: Currency) => {
                switch (ccy.symbol) {
                    case CurrencySymbol.ETH:
                        return Promise.resolve([
                            BigInt(9686),
                            BigInt(9684),
                            BigInt(9678),
                            BigInt(9673),
                            BigInt(9652),
                            BigInt(9642),
                            BigInt(9626),
                            BigInt(9616),
                        ]);
                    case CurrencySymbol.WFIL:
                        return Promise.resolve([
                            BigInt(9586),
                            BigInt(9584),
                            BigInt(9578),
                            BigInt(9573),
                            BigInt(9552),
                            BigInt(9542),
                            BigInt(9526),
                            BigInt(9516),
                        ]);
                    case CurrencySymbol.USDC:
                        return Promise.resolve([
                            BigInt(9486),
                            BigInt(9484),
                            BigInt(9478),
                            BigInt(9473),
                            BigInt(9452),
                            BigInt(9442),
                            BigInt(9426),
                            BigInt(9416),
                        ]);
                    case CurrencySymbol.WBTC:
                        return Promise.resolve([
                            BigInt(9386),
                            BigInt(9384),
                            BigInt(9378),
                            BigInt(9373),
                            BigInt(9352),
                            BigInt(9342),
                            BigInt(9326),
                            BigInt(9316),
                        ]);
                    default:
                        throw new Error('Not implemented');
                }
            }),
        getCollateralBook: jest.fn(() =>
            Promise.resolve({
                collateral: {
                    ...collateralBook37.collateral,
                    ...collateralBook37.nonCollateral,
                },
                collateralCoverage: collateralBook37.coverage,
            })
        ),

        getLendingMarket: jest.fn((_, maturity: number) => {
            if (maturity === dec24Fixture.toNumber()) {
                return Promise.resolve({
                    isItayosePeriod: jest.fn(() => Promise.resolve(false)),
                    isOpened: jest.fn(() => Promise.resolve(false)),
                    isPreOrderPeriod: jest.fn(() => Promise.resolve(true)),
                });
            } else {
                return Promise.resolve({
                    isItayosePeriod: jest.fn(() => Promise.resolve(false)),
                    isOpened: jest.fn(() => Promise.resolve(true)),
                    isPreOrderPeriod: jest.fn(() => Promise.resolve(false)),
                });
            }
        }),

        getMaturities: jest.fn(() =>
            Promise.resolve([
                BigInt('1000'),
                BigInt('2000'),
                BigInt('3000'),
                BigInt('4000'),
                BigInt('5000'),
            ])
        ),

        getOrderBookDetails: jest.fn(() => {
            const maturities = [
                maturitiesMockFromContract(ethBytes32),
                maturitiesMockFromContract(wfilBytes32),
                maturitiesMockFromContract(wbtcBytes32),
                maturitiesMockFromContract(usdcBytes32),
            ];
            return Promise.resolve(
                maturities.reduce((r, e) => (r.push(...e), r), [])
            );
        }),

        depositCollateral: jest.fn(() =>
            Promise.resolve('0xb98bd7c7f656290hu071e52d1a56e6uyh98765e4')
        ),

        withdrawCollateral: jest.fn(() =>
            Promise.resolve('0xb98bd7c7f656290hu071e52d1a56e6uyh98765e4')
        ),

        getBorrowOrderBook: jest.fn((_, __, limit: number) =>
            Promise.resolve(generateOrderbook(limit))
        ),

        getLendOrderBook: jest.fn((_, __, limit: number) =>
            Promise.resolve(generateOrderbook(limit))
        ),

        getERC20Balance: jest.fn((token: Token, _) => {
            let balance = ZERO_BI;
            if (token.symbol === CurrencySymbol.WFIL) {
                balance = BigInt('10000000000000000000000'); // 10,000 WFIL
            } else if (token.symbol === CurrencySymbol.WBTC) {
                balance = BigInt('30000000000'); // 300 WBTC
            } else if (token.symbol === CurrencySymbol.USDC) {
                balance = BigInt('4000000000'); // 4,000 USDC
            }
            return Promise.resolve(balance);
        }),

        cancelLendingOrder: jest.fn(() =>
            Promise.resolve('0xb98bd7c7f656290hu071e52d1a56e6uyh98765e4')
        ),

        getERC20TokenContractAddress: jest.fn(() =>
            Promise.resolve('0xEd4733fE7BAc4C2934F7e9CE4e0696b2169701D8')
        ),

        mintERC20Token: jest.fn(() =>
            Promise.resolve('0xb98bd7c7f656290hu071e52d1a56e6uyh98765e4')
        ),

        getCurrencies: jest.fn(() =>
            Promise.resolve([ethBytes32, wfilBytes32, wbtcBytes32, usdcBytes32])
        ),

        getProtocolDepositAmount: jest.fn(() =>
            Promise.resolve({
                ETH: BigInt('100000000000000000000'), // 100 ETH
                WFIL: BigInt('100000000000000000000000'), // 100 000 WFIL
                USDC: BigInt('1000000000000'), // 1 000 000 USDC
                WBTC: BigInt('1000000000000'), // 1000 BTC
            })
        ),

        unwindPosition: jest.fn(() => Promise.resolve('0x123')),

        getCollateralParameters: jest.fn(() =>
            Promise.resolve({
                liquidationThresholdRate: BigInt('12500'),
            })
        ),

        getWithdrawableCollateral: jest.fn(() =>
            Promise.resolve(BigInt(1000000000000))
        ),

        getUsedCurrenciesForOrders: jest.fn(() =>
            Promise.resolve([ethBytes32, wfilBytes32, wbtcBytes32, usdcBytes32])
        ),

        getOrderList: jest.fn((_, useCurrencies: Currency[]) => {
            const filterFn = (order: { ccy: string }) =>
                useCurrencies.includes(
                    currencyMap[
                        hexToCurrencySymbol(order.ccy) ?? CurrencySymbol.WFIL
                    ].toCurrency()
                );
            return Promise.resolve({
                activeOrders: [
                    {
                        orderId: 1,
                        ccy: ethBytes32,
                        side: 0,
                        maturity: BigInt(dec22Fixture.toString()),
                        unitPrice: BigInt('9800'),
                        amount: BigInt('1000000000000000000'),
                        timestamp: BigInt('1609210000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 2,
                        ccy: ethBytes32,
                        side: 0,
                        maturity: BigInt(mar23Fixture.toString()),
                        unitPrice: BigInt('9800'),
                        amount: BigInt('100000000000000000'),
                        timestamp: BigInt('1609220000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 3,
                        ccy: wfilBytes32,
                        side: 1,
                        maturity: BigInt(dec22Fixture.toString()),
                        unitPrice: BigInt('9800'),
                        amount: BigInt('100000000000000000000'),
                        timestamp: BigInt('1609205000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 1,
                        ccy: wbtcBytes32,
                        side: 0,
                        maturity: BigInt(dec22Fixture.toString()),
                        unitPrice: BigInt('9800'),
                        amount: BigInt('500000000'),
                        timestamp: BigInt('1609212000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 5,
                        ccy: wfilBytes32,
                        side: 1,
                        maturity: BigInt(dec24Fixture.toString()),
                        unitPrice: BigInt('7800'),
                        amount: BigInt('100000000000000000000'),
                        timestamp: BigInt('1409220000'),
                        isPreOrder: true,
                    },
                    ...generateSimpleOrders(
                        jun23Fixture.toNumber(),
                        wfilBytes32,
                        false,
                        20
                    ),
                    ...generateSimpleOrders(
                        dec24Fixture.toNumber(),
                        wfilBytes32,
                        true,
                        20
                    ),
                ].filter(order => filterFn(order)),
                inactiveOrders: [
                    {
                        orderId: 1,
                        ccy: ethBytes32,
                        side: 0,
                        maturity: BigInt(dec22Fixture.toString()),
                        unitPrice: BigInt('9800'),
                        amount: BigInt('450000000000000000'),
                        timestamp: BigInt('1609295092'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 1,
                        ccy: wfilBytes32,
                        side: 1,
                        maturity: BigInt(dec22Fixture.toString()),
                        unitPrice: BigInt('9800'),
                        amount: BigInt('1000000000000000000000'),
                        timestamp: BigInt('1609295092'),
                        isPreOrder: false,
                    },
                ].filter(order => filterFn(order)),
            });
        }),

        getPositions: jest.fn(() =>
            Promise.resolve([
                {
                    ccy: ethBytes32,
                    maturity: dec22Fixture.toString(),
                    presentValue: BigInt('9954750000000000000'),
                    futureValue: BigInt('10210000000000000000'),
                },
                {
                    ccy: ethBytes32,
                    maturity: mar23Fixture.toString(),
                    presentValue: BigInt('-10558255657026800000'),
                    futureValue: BigInt('-11113953323186200000'),
                },
                {
                    ccy: wfilBytes32,
                    maturity: dec22Fixture.toString(),
                    presentValue: BigInt('9954750000000000000'),
                    futureValue: BigInt('10210000000000000000'),
                },
                {
                    ccy: usdcBytes32,
                    maturity: mar23Fixture.toString(),
                    presentValue: BigInt('-63000000'),
                    futureValue: BigInt('-67000000'),
                },
            ])
        ),

        getOrderFeeRate: jest.fn(() => Promise.resolve(BigInt('100'))),

        getOrderEstimation: jest.fn(() =>
            Promise.resolve({ coverage: BigInt(5500) })
        ),

        currencyExists: jest.fn((currency: Currency) => {
            if (currency.symbol === CurrencySymbol.USDC) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }),

        executeRepayment: jest.fn(() => Promise.resolve('0x123')),

        executeRedemption: jest.fn(() => Promise.resolve('0x123')),

        isTerminated: jest.fn(() => Promise.resolve(false)),

        getMarketTerminationDate: jest.fn(() =>
            Promise.resolve(BigInt('1609210000'))
        ),

        getMarketTerminationRatio: jest.fn((currency: Currency) => {
            switch (currency.symbol) {
                case CurrencySymbol.ETH:
                    return Promise.resolve(BigInt('10000000000'));
                case CurrencySymbol.USDC:
                    return Promise.resolve(BigInt('20000000000'));
                case CurrencySymbol.WBTC:
                    return Promise.resolve(BigInt('20000000000'));
                default:
                    throw new Error('Not implemented');
            }
        }),

        getMarketTerminationPrice: jest.fn((currency: Currency) => {
            switch (currency.symbol) {
                case CurrencySymbol.ETH:
                    return Promise.resolve(BigInt('157771480752')); // 1577.71480752
                case CurrencySymbol.WFIL:
                    return Promise.resolve(
                        BigInt('320452554902293372851000000')
                    );
                case CurrencySymbol.USDC:
                    return Promise.resolve(BigInt('100000000'));
                case CurrencySymbol.WBTC:
                    return Promise.resolve(BigInt('2557771480752'));
                default:
                    throw new Error('Not implemented');
            }
        }),

        isRedemptionRequired: jest.fn(() => Promise.resolve(true)),

        getCollateralCurrencies: jest.fn(() =>
            Promise.resolve([ethBytes32, wbtcBytes32, usdcBytes32])
        ),

        executeEmergencySettlement: jest.fn(() => Promise.resolve('0x123')),
    };

    return mockSecuredFinance;
};
