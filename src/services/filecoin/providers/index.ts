import RustModule from '@zondax/filecoin-signing-tools';
import { HDWalletProvider } from './HDWalletProvider';
import { PrivateKeyProvider } from './PrivateKeyProvider';
export type { ExtendedKey } from './types';

export const providers = (wasm: RustModule) => ({
    HDWalletProvider: HDWalletProvider(wasm),
    PrivateKeyProvider: PrivateKeyProvider(wasm),
});

export type WalletProviders = ReturnType<typeof providers>;
