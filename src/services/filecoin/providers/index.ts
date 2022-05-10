import { HDWalletProvider } from './HDWalletProvider';
import { PrivateKeyProvider } from './PrivateKeyProvider';
export type { ExtendedKey } from './types';

export const providers = (wasm: any) => ({
    HDWalletProvider: HDWalletProvider(wasm),
    PrivateKeyProvider: PrivateKeyProvider(wasm),
});
