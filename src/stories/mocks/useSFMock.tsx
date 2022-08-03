import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';

export const mockUseSF = () => {
    const mockSecuredFinance = {
        placeLendingOrder: jest.fn(),
        getBorrowYieldCurve: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('100'),
                BigNumber.from('200'),
                BigNumber.from('300'),
                BigNumber.from('400'),
                BigNumber.from('500'),
                BigNumber.from('600'),
            ])
        ),
        getLendYieldCurve: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('50'),
                BigNumber.from('150'),
                BigNumber.from('250'),
                BigNumber.from('350'),
                BigNumber.from('450'),
                BigNumber.from('550'),
            ])
        ),
        getCollateralBook: jest.fn(() =>
            Promise.resolve({
                independentCollateral: new BigNumberJS('10000'),
                lockedCollateral: new BigNumberJS('10000'),
            })
        ),
        lendingMarkets: {
            get: jest.fn(() =>
                Promise.resolve({
                    contract: {
                        address: '0x0',
                    },
                })
            ),
        },
        getCrosschainAddress: jest.fn(() => Promise.resolve('fil0x0')),
        checkRegisteredUser: jest.fn<Promise<boolean> | undefined, []>(() =>
            Promise.resolve(true)
        ),
    };

    return mockSecuredFinance;
};
