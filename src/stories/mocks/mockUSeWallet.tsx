import * as jest from 'jest-mock';

export const mockUSeWallet = () => {
    const useWalletMock = {
        connect: jest.fn(() => {
            Promise.resolve();
        }),
        account: 'account',
    };

    return useWalletMock;
};
