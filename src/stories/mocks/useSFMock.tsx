import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';
import * as jest from 'jest-mock';

export const mockUseSF = () => {
    const mockSecuredFinance = {
        placeLendingOrder: jest.fn(),
        getBorrowUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9923),
                BigNumber.from(9998),
                BigNumber.from(9790),
                BigNumber.from(9685),
            ])
        ),
        getLendUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9979),
                BigNumber.from(9974),
                BigNumber.from(9770),
                BigNumber.from(9668),
            ])
        ),
        getMidUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9900),
                BigNumber.from(9900),
                BigNumber.from(9700),
                BigNumber.from(9600),
            ])
        ),
        getCollateralBook: jest.fn(() =>
            Promise.resolve({
                collateralAmount: new BigNumberJS('10000'),
                collateralCoverage: new BigNumberJS('80'),
            })
        ),
        getLendingMarket: jest.fn(() =>
            Promise.resolve({
                contract: {
                    address: '0x0',
                },
            })
        ),

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
                },
                {
                    midRate: 100,
                    lendRate: 200,
                    borrowRate: 300,
                    maturity: 2000,
                    name: 'ETH-2000',
                },
            ])
        ),

        depositCollateral: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
            })
        ),

        withdrawCollateral: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() =>
                    Promise.resolve({ blockNumber: undefined })
                ),
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
    };

    return mockSecuredFinance;
};
