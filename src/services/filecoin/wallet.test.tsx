import { registerCrossChainWallet } from './wallet';

describe('Wallet', () => {
    const onMockRegisterCrossChainWallet = jest.fn();
    beforeEach(() => {
        onMockRegisterCrossChainWallet.mockClear();
    });

    const onChainWallet = '0x0';

    it('should register a cross chain wallet if there is no on chain wallet already registered', async () => {
        expect(
            await registerCrossChainWallet(
                '',
                '0x0',
                onMockRegisterCrossChainWallet
            )
        ).toEqual('0x0');
        expect(onMockRegisterCrossChainWallet).toHaveBeenCalled();
    });

    it('should not register a cross chain wallet if there is already an on chain wallet registered with the same address', async () => {
        expect(
            await registerCrossChainWallet(
                onChainWallet,
                '0x0',
                onMockRegisterCrossChainWallet
            )
        ).toEqual('0x0');
        expect(onMockRegisterCrossChainWallet).not.toHaveBeenCalled();
    });

    it('should update the cross chain wallet if there is already a cross chain wallet registered with a different address', async () => {
        expect(
            await registerCrossChainWallet(
                onChainWallet,
                '1x0',
                onMockRegisterCrossChainWallet
            )
        ).toEqual('1x0');
        expect(onMockRegisterCrossChainWallet).toHaveBeenCalled();
    });

    it('should return the cross chain address if an error happens', async () => {
        expect(
            await registerCrossChainWallet(onChainWallet, '1x0', () => {
                throw new Error('test');
            })
        ).toEqual('0x0');
    });

    it('should return the current address if an error happens and the cross chain in not defined', async () => {
        expect(
            await registerCrossChainWallet('', '1x0', () => {
                throw new Error('test');
            })
        ).toEqual('1x0');
    });
});
