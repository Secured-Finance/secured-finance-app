import { Currency } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import * as jest from 'jest-mock';
import { CurrencySymbol, getCurrencyMapAsList } from 'src/utils';
import { collateralBook80, dec24Fixture } from './fixtures';
import {
    dec22Fixture,
    mar23Fixture,
    ethBytes32,
    efilBytes32,
} from './fixtures';

export const mockUseSF = () => {
    const mockSecuredFinance = {
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
                    case CurrencySymbol.EFIL:
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
                    ...collateralBook80.collateral,
                    ...collateralBook80.nonCollateral,
                },
                collateralCoverage: collateralBook80.coverage,
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

        getLendingMarkets: jest.fn(() =>
            Promise.resolve([
                {
                    midRate: 100,
                    lendRate: 200,
                    borrowRate: 300,
                    maturity: 1000,
                    name: 'ETH-1000',
                    utcOpeningDate: 1620000000,
                },
                {
                    midRate: 100,
                    lendRate: 200,
                    borrowRate: 300,
                    maturity: 2000,
                    name: 'ETH-2000',
                    utcOpeningDate: 1720000000,
                },
            ])
        ),

        depositCollateral: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
                to: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
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

        getBorrowOrderBook: jest.fn(() =>
            Promise.resolve({
                unitPrices: [
                    BigNumber.from(9690),
                    BigNumber.from(9687),
                    BigNumber.from(9685),
                    BigNumber.from(9679),
                    BigNumber.from(9674),
                ],
                amounts: [
                    BigNumber.from('43000000000000000000000'),
                    BigNumber.from('23000000000000000000000'),
                    BigNumber.from('15000000000000000000000'),
                    BigNumber.from('12000000000000000000000'),
                    BigNumber.from('1800000000000000000000'),
                ],
                quantities: [
                    BigNumber.from('1000'),
                    BigNumber.from('2000'),
                    BigNumber.from('3000'),
                    BigNumber.from('4000'),
                    BigNumber.from('5000'),
                ],
            })
        ),

        getLendOrderBook: jest.fn(() =>
            Promise.resolve({
                unitPrices: [
                    BigNumber.from(9690),
                    BigNumber.from(9687),
                    BigNumber.from(9685),
                    BigNumber.from(9679),
                    BigNumber.from(9674),
                ],
                amounts: [
                    BigNumber.from('43000000000000000000000'),
                    BigNumber.from('23000000000000000000000'),
                    BigNumber.from('15000000000000000000000'),
                    BigNumber.from('12000000000000000000000'),
                    BigNumber.from('1800000000000000000000'),
                ],
                quantities: [
                    BigNumber.from('1000'),
                    BigNumber.from('2000'),
                    BigNumber.from('3000'),
                    BigNumber.from('4000'),
                    BigNumber.from('5000'),
                ],
            })
        ),

        getERC20Balance: jest.fn(() => Promise.resolve({ balance: 10000000 })),

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
            Promise.resolve(
                getCurrencyMapAsList().map(currency => currency.symbol)
            )
        ),

        getProtocolDepositAmount: jest.fn(() =>
            Promise.resolve({
                ETH: BigNumber.from('100000000000000000000'), // 100 ETH
                EFIL: BigNumber.from('100000000000000000000000'), // 100 000 EFIL
                USDC: BigNumber.from('1000000000000'), // 1 000 000 USDC
                WBTC: BigNumber.from('1000000000000'), // 1000 BTC
            })
        ),

        unwindOrder: jest.fn(() =>
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

        getUsedCurrenciesForOrders: jest.fn(() =>
            Promise.resolve([ethBytes32, efilBytes32])
        ),

        getOrderList: jest.fn(() =>
            Promise.resolve({
                activeOrders: [
                    {
                        orderId: 1,
                        ccy: ethBytes32,
                        side: 0,
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('1000000000'),
                        timestamp: BigNumber.from('1609295092'),
                    },
                    {
                        orderId: 2,
                        ccy: ethBytes32,
                        side: 0,
                        maturity: BigNumber.from(mar23Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('1000000000'),
                        timestamp: BigNumber.from('1609295092'),
                    },
                    {
                        orderId: 1,
                        ccy: efilBytes32,
                        side: 1,
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('1000000000'),
                        timestamp: BigNumber.from('1609295092'),
                    },
                ],
                inactiveOrders: [
                    {
                        orderId: 4,
                        ccy: ethBytes32,
                        side: 0,
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('1000000000'),
                        timestamp: BigNumber.from('1609295092'),
                    },
                    {
                        orderId: 5,
                        ccy: efilBytes32,
                        side: 0,
                        maturity: BigNumber.from(dec22Fixture.toString()),
                        unitPrice: BigNumber.from('9800'),
                        amount: BigNumber.from('1000000000'),
                        timestamp: BigNumber.from('1609295092'),
                    },
                ],
            })
        ),
    };

    return mockSecuredFinance;
};
