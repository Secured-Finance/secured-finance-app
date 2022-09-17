import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';
import * as jest from 'jest-mock';

export const mockUseSF = () => {
    const mockSecuredFinance = {
        placeLendingOrder: jest.fn(),
        getBorrowYieldCurve: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('100'),
                BigNumber.from('200'),
                BigNumber.from('300'),
                BigNumber.from('400'),
            ])
        ),
        getLendYieldCurve: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('50'),
                BigNumber.from('150'),
                BigNumber.from('250'),
                BigNumber.from('350'),
            ])
        ),
        getCollateralBook: jest.fn(() =>
            Promise.resolve({
                collateralAmount: new BigNumberJS('10000'),
                collateralCoverage: new BigNumberJS('10000'),
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
    };

    return mockSecuredFinance;
};
