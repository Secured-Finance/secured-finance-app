declare module '@zondax/filecoin-signing-tools' {
    interface RustModule {
        transactionSerialize?: (filecoinMessage: string) => string;
    }
    export default RustModule;
}
declare module '@zondax/ledger-filecoin';
