import { TESTNET_PATH_CODE } from '../ledger/constants';
import { CrossChainWallet, registerCrossChainWallet } from './wallet';

describe('Wallet', () => {
    const onChainWallet: CrossChainWallet = {
        address: '0x0',
        chainId: TESTNET_PATH_CODE.toString(),
    };
    const onMockRegisterCrossChainWallet = jest.fn();

    it('should register a cross chain wallet if there is no on chain wallet already registered', async () => {
        expect(
            await registerCrossChainWallet(
                null,
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
});
