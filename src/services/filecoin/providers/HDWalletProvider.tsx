import { Network } from '@glif/filecoin-address';
import { LotusMessage, SignedLotusMessage } from '@glif/filecoin-message';
import { WalletSubProvider } from '@glif/filecoin-wallet-provider';
import { MainNetPath, TestNetPath } from '../utils';
import { ExtendedKey } from './types';

export function HDWalletProvider(wasm: any) {
    return (mnemonic: string | Buffer): WalletSubProvider => {
        const MNEMONIC = mnemonic;
        return {
            getAccounts: async (
                _nStart: number,
                _nEnd = 5,
                network: string = Network.TEST
            ) => {
                const path =
                    network === Network.TEST ? TestNetPath : MainNetPath;

                return [wasm.keyDerive(MNEMONIC, path, '').address];
            },

            sign: async (
                _from: string,
                filecoinMessage: LotusMessage
            ): Promise<SignedLotusMessage> => {
                const path = Network.TEST ? TestNetPath : MainNetPath;

                const private_hexstring: ExtendedKey = wasm.keyDerive(
                    MNEMONIC,
                    path,
                    ''
                );

                const signedTx = wasm.transactionSignLotus(
                    filecoinMessage,
                    private_hexstring.private_base64
                );

                return JSON.parse(signedTx) as SignedLotusMessage;
            },
        };
    };
}
