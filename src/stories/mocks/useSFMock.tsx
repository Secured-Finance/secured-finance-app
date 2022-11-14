import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';
import * as jest from 'jest-mock';

export const mockUseSF = () => {
    const mockSecuredFinance = {
        placeLendingOrder: jest.fn(),
        getBorrowYieldCurve: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('10000'),
                BigNumber.from('20000'),
                BigNumber.from('30000'),
                BigNumber.from('40000'),
            ])
        ),
        getLendYieldCurve: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('5000'),
                BigNumber.from('15000'),
                BigNumber.from('25000'),
                BigNumber.from('35000'),
            ])
        ),
        getMidRateYieldCurve: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('5000'),
                BigNumber.from('15000'),
                BigNumber.from('25000'),
                BigNumber.from('35000'),
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
                rates: [
                    BigNumber.from(195000),
                    BigNumber.from(183000),
                    BigNumber.from(180000),
                    BigNumber.from(170000),
                    BigNumber.from(160000),
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
                rates: [
                    BigNumber.from(195000),
                    BigNumber.from(183000),
                    BigNumber.from(180000),
                    BigNumber.from(170000),
                    BigNumber.from(160000),
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
