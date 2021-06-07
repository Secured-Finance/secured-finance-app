declare module '@zondax/filecoin-signing-tools' {
    import { SerializableMessage } from '@glif/filecoin-message';

    interface RustModule {
        transactionSerialize?: (filecoinMessage: SerializableMessage) => string;
    }
    export default RustModule;
}
declare module '@zondax/ledger-filecoin';

declare module '@ledgerhq/hw-transport-webhid';
