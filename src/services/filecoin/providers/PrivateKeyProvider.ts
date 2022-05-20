import { Network } from '@glif/filecoin-address';
import { LotusMessage, SignedLotusMessage } from '@glif/filecoin-message';
import { WalletSubProvider } from '@glif/filecoin-wallet-provider';
import RustModule from '@zondax/filecoin-signing-tools';
import { getFilecoinNetwork } from '../utils';
import { ExtendedKey } from './types';

export const PrivateKeyProvider = (wasm: RustModule) => {
    return (privateKey: string | Buffer): WalletSubProvider => {
        const PRIVATE_KEY = privateKey;
        const { private_base64 } = wasm.keyRecover(
            PRIVATE_KEY,
            getFilecoinNetwork() === Network.TEST
        ) as ExtendedKey;
        return {
            getAccounts: async (
                _nStart: number,
                _nEnd = 5,
                network: string = Network.TEST
            ) => {
                return [
                    wasm.keyRecover(PRIVATE_KEY, network === Network.TEST)
                        .address,
                ];
            },

            sign: async (
                _from: string,
                filecoinMessage: LotusMessage
            ): Promise<SignedLotusMessage> => {
                const signedTx = wasm.transactionSignLotus(
                    filecoinMessage,
                    private_base64
                );

                return JSON.parse(signedTx) as SignedLotusMessage;
            },
        };
    };
};
