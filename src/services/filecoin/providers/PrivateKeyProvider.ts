import * as wasm from "@zondax/filecoin-signing-tools"
import { WalletSubProvider } from "@glif/filecoin-wallet-provider"
import { Network } from "@glif/filecoin-address"
import { LotusMessage, SignedLotusMessage } from "@glif/filecoin-message"

export const PrivateKeyProvider = (privateKey: string | Buffer): WalletSubProvider => {
    const PRIVATE_KEY = privateKey;
    const { private_hexstring } = wasm.keyRecover(PRIVATE_KEY);
    return {
        getAccounts: async (_nStart: number, _nEnd: number = 5, network: string = Network.TEST) => {
            return [
                wasm.keyRecover(
                    PRIVATE_KEY,
                    network === Network.TEST
                ).address,
            ];
        },

        sign: async (_from: string, filecoinMessage: LotusMessage): Promise<SignedLotusMessage> => {
            const { signature } = wasm.transactionSign(
                filecoinMessage,
                Buffer.from(private_hexstring, 'hex').toString('base64')
            )
            return {
                Message: filecoinMessage,
                Signature: {
                    Type: 0,
                    Data: signature.data,
                },
            };
        },
    };
};
