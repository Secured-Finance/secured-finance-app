import { WalletSubProvider } from "@glif/filecoin-wallet-provider"
import { Network } from "@glif/filecoin-address"
import { LotusMessage, SignedLotusMessage } from "@glif/filecoin-message"
import { MainNetPath, TestNetPath } from "../utils"

export const HDWalletProvider = (wasm: any, mnemonic: string | Buffer): WalletSubProvider => {
    const MNEMONIC = mnemonic
    return {
        getAccounts: async (_nStart: number, _nEnd: number = 5, network: string = Network.TEST) => {
            const path = network === Network.TEST ? TestNetPath : MainNetPath
            
            return [
                wasm.keyDerive(MNEMONIC, path, '').address
            ]
        },

        sign: async (_from: string, filecoinMessage: LotusMessage): Promise<SignedLotusMessage> => {
            const path = Network.TEST ? TestNetPath : MainNetPath

            const private_hexstring = wasm.keyDerive(MNEMONIC, path, '')
            const { signature } = wasm.transactionSign(filecoinMessage,
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
