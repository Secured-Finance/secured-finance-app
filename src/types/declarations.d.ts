declare module '@zondax/filecoin-signing-tools' {
    import { SerializableMessage } from '@glif/filecoin-message';
    interface RustModule {
        // this interface is the types for the filecoin-signing-tools with only what we use.
        // the full api can be found here: https://github.com/Zondax/filecoin-signing-tools/blob/master/docs/wasm_api.md
        transactionSerialize?: (filecoinMessage: SerializableMessage) => string;
        generateMnemonic: () => string;
        keyDerive: (
            buffer: string | Buffer,
            path: string,
            seed: string
        ) => ExtendedKey;
        transactionSignLotus: (
            message: LotusMessage,
            privateKey: string
        ) => string;
        keyRecover: (
            privateKey: string | Buffer,
            testnet: boolean
        ) => ExtendedKey;
    }
    export default RustModule;
}
declare module '@zondax/ledger-filecoin';

declare module '@ledgerhq/hw-transport-webhid';
declare module '*.scss';
