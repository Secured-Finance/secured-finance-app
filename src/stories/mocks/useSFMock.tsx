import { Currency, Token } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import * as jest from 'jest-mock';
import {
    CurrencySymbol,
    ZERO_BN,
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
        BigNumber.from(9690),
        BigNumber.from(9687),
        BigNumber.from(9685),
        BigNumber.from(9679),
        BigNumber.from(9674),
    ];

    const zeros = Array(depth - unitPrices.length).fill(BigNumber.from(0));

    const amounts = [
        BigNumber.from('43000000000000000000000'),
        BigNumber.from('23000000000000000000000'),
        BigNumber.from('15000000000000000000000'),
        BigNumber.from('12000000000000000000000'),
        BigNumber.from('1800000000000000000000'),
    ];

    const quantities = [
        BigNumber.from('1000'),
        BigNumber.from('2000'),
        BigNumber.from('3000'),
        BigNumber.from('4000'),
        BigNumber.from('5000'),
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
            maturity: BigNumber.from(maturity),
            unitPrice: BigNumber.from('9800'),
            amount: BigNumber.from('1000000000000000000'),
            timestamp: BigNumber.from('1609210000'),
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
                BigNumber.from(9687),
                BigNumber.from(9685),
                BigNumber.from(9679),
                BigNumber.from(9674),
                BigNumber.from(9653),
                BigNumber.from(9643),
                BigNumber.from(9627),
                BigNumber.from(9617),
            ])
        ),
        getLendUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9685),
                BigNumber.from(9683),
                BigNumber.from(9677),
                BigNumber.from(9672),
                BigNumber.from(9651),
                BigNumber.from(9641),
                BigNumber.from(9625),
                BigNumber.from(9615),
            ])
        ),
        getMidUnitPrices: jest
            .fn<Promise<BigNumber[]>, Currency[]>()
            .mockImplementation((ccy: Currency) => {
                switch (ccy.symbol) {
                    case CurrencySymbol.ETH:
                        return Promise.resolve([
                            BigNumber.from(9686),
                            BigNumber.from(9684),
                            BigNumber.from(9678),
                            BigNumber.from(9673),
                            BigNumber.from(9652),
                            BigNumber.from(9642),
                            BigNumber.from(9626),
                            BigNumber.from(9616),
                        ]);
                    case CurrencySymbol.WFIL:
                        return Promise.resolve([
                            BigNumber.from(9586),
                            BigNumber.from(9584),
                            BigNumber.from(9578),
                            BigNumber.from(9573),
                            BigNumber.from(9552),
                            BigNumber.from(9542),
                            BigNumber.from(9526),
                            BigNumber.from(9516),
                        ]);
                    case CurrencySymbol.USDC:
                        return Promise.resolve([
                            BigNumber.from(9486),
                            BigNumber.from(9484),
                            BigNumber.from(9478),
                            BigNumber.from(9473),
                            BigNumber.from(9452),
                            BigNumber.from(9442),
                            BigNumber.from(9426),
                            BigNumber.from(9416),
                        ]);
                    case CurrencySymbol.WBTC:
                        return Promise.resolve([
                            BigNumber.from(9386),
                            BigNumber.from(9384),
                            BigNumber.from(9378),
                            BigNumber.from(9373),
                            BigNumber.from(9352),
                            BigNumber.from(9342),
                            BigNumber.from(9326),
                            BigNumber.from(9316),
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
                BigNumber.from('1000'),
                BigNumber.from('2000'),
                BigNumber.from('3000'),
                BigNumber.from('4000'),
                BigNumber.from('5000'),
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
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
                to: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                hash: '0xb98bd7c7f656290hu071e52d1a56e6uyh98765e4',
            })
        ),

        withdrawCollateral: jest.fn<
            Promise<{
                wait: () => Promise<{
                    blockNumber: number | undefined;
                }>;
            }>,
            []
        >(() =>
            Promise.resolve({
                wait: () => Promise.resolve({ blockNumber: 123 }),
            })
        ),

        getBorrowOrderBook: jest.fn((_, __, limit: number) =>
            Promise.resolve(generateOrderbook(limit))
        ),

        getLendOrderBook: jest.fn((_, __, limit: number) =>
            Promise.resolve(generateOrderbook(limit))
        ),

        getERC20Balance: jest.fn((token: Token, _) => {
            let balance = ZERO_BN;
            if (token.symbol === CurrencySymbol.WFIL) {
                balance = BigNumber.from('10000000000000000000000'); // 10,000 WFIL
            } else if (token.symbol === CurrencySymbol.WBTC) {
                balance = BigNumber.from('30000000000'); // 300 WBTC
            } else if (token.symbol === CurrencySymbol.USDC) {
                balance = BigNumber.from('4000000000'); // 4,000 USDC
            }
            return Promise.resolve(balance);
        }),

        cancelLendingOrder: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
            })
        ),

        getERC20TokenContractAddress: jest.fn(() =>
            Promise.resolve('0xEd4733fE7BAc4C2934F7e9CE4e0696b2169701D8')
        ),

        mintERC20Token: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
            })
        ),

        getCurrencies: jest.fn(() =>
            Promise.resolve([ethBytes32, wfilBytes32, wbtcBytes32, usdcBytes32])
        ),

        getProtocolDepositAmount: jest.fn(() =>
            Promise.resolve({
                ETH: BigNumber.from('100000000000000000000'), // 100 ETH
                WFIL: BigNumber.from('100000000000000000000000'), // 100 000 WFIL
                USDC: BigNumber.from('1000000000000'), // 1 000 000 USDC
                WBTC: BigNumber.from('1000000000000'), // 1000 BTC
            })
        ),

        unwindPosition: jest.fn(() =>
            Promise.resolve({
                hash: '0x123',
                wait: jest.fn(() =>
                    Promise.resolve({
                        blockNumber: 123,
                    })
                ),
            })
        ),

        getCollateralParameters: jest.fn(() =>
            Promise.resolve({
                liquidationThresholdRate: BigNumber.from('12500'),
            })
        ),

        getWithdrawableCollateral: jest.fn(() =>
            Promise.resolve(BigNumber.from(1000000000000))
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
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('1000000000000000000'),
                        timestamp: BigNumber.from('1609210000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 2,
                        ccy: ethBytes32,
                        side: 0,
                        maturity: BigNumber.from(mar23Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('100000000000000000'),
                        timestamp: BigNumber.from('1609220000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 3,
                        ccy: wfilBytes32,
                        side: 1,
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('100000000000000000000'),
                        timestamp: BigNumber.from('1609205000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 1,
                        ccy: wbtcBytes32,
                        side: 0,
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('500000000'),
                        timestamp: BigNumber.from('1609212000'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 5,
                        ccy: wfilBytes32,
                        side: 1,
                        maturity: BigNumber.from(dec24Fixture.toString()),
                        unitPrice: BigNumber.from('7800'),
                        amount: BigNumber.from('100000000000000000000'),
                        timestamp: BigNumber.from('1409220000'),
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
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('450000000000000000'),
                        timestamp: BigNumber.from('1609295092'),
                        isPreOrder: false,
                    },
                    {
                        orderId: 1,
                        ccy: wfilBytes32,
                        side: 1,
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('1000000000000000000000'),
                        timestamp: BigNumber.from('1609295092'),
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
                    presentValue: BigNumber.from('9954750000000000000'),
                    futureValue: BigNumber.from('10210000000000000000'),
                },
                {
                    ccy: ethBytes32,
                    maturity: mar23Fixture.toString(),
                    presentValue: BigNumber.from('-10558255657026800000'),
                    futureValue: BigNumber.from('-11113953323186200000'),
                },
                {
                    ccy: wfilBytes32,
                    maturity: dec22Fixture.toString(),
                    presentValue: BigNumber.from('9954750000000000000'),
                    futureValue: BigNumber.from('10210000000000000000'),
                },
                {
                    ccy: wfilBytes32,
                    maturity: mar23Fixture.toString(),
                    presentValue: BigNumber.from('-10558255657026800000'),
                    futureValue: BigNumber.from('-11113953323186200000'),
                },
            ])
        ),

        getOrderFeeRate: jest.fn(() => Promise.resolve(BigNumber.from('100'))),

        getOrderEstimation: jest.fn(() =>
            Promise.resolve({ coverage: BigNumber.from('5500') })
        ),

        currencyExists: jest.fn((currency: Currency) => {
            if (currency.symbol === CurrencySymbol.WFIL) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        }),

        executeRepayment: jest.fn(() => Promise.resolve({})),

        executeRedemption: jest.fn(() => Promise.resolve({})),

        isTerminated: jest.fn(() => Promise.resolve(false)),

        getMarketTerminationDate: jest.fn(() =>
            Promise.resolve(BigNumber.from('1609210000'))
        ),

        getMarketTerminationRatio: jest.fn((currency: Currency) => {
            switch (currency.symbol) {
                case CurrencySymbol.ETH:
                    return Promise.resolve(BigNumber.from('10000000000'));
                case CurrencySymbol.USDC:
                    return Promise.resolve(BigNumber.from('20000000000'));
                case CurrencySymbol.WBTC:
                    return Promise.resolve(BigNumber.from('20000000000'));
                default:
                    throw new Error('Not implemented');
            }
        }),

        getMarketTerminationPrice: jest.fn((currency: Currency) => {
            switch (currency.symbol) {
                case CurrencySymbol.ETH:
                    return Promise.resolve(BigNumber.from('157771480752')); // 1577.71480752
                case CurrencySymbol.WFIL:
                    return Promise.resolve(
                        BigNumber.from('320452554902293372851000000')
                    );
                case CurrencySymbol.USDC:
                    return Promise.resolve(BigNumber.from('100000000'));
                case CurrencySymbol.WBTC:
                    return Promise.resolve(BigNumber.from('2557771480752'));
                default:
                    throw new Error('Not implemented');
            }
        }),

        isRedemptionRequired: jest.fn(() => Promise.resolve(true)),

        getCollateralCurrencies: jest.fn(() =>
            Promise.resolve([ethBytes32, wbtcBytes32, usdcBytes32])
        ),

        executeEmergencySettlement: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
            })
        ),
    };

    return mockSecuredFinance;
};
