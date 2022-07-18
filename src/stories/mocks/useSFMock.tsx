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
    };

    return mockSecuredFinance;
};
