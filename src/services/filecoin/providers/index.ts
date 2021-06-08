import { HDWalletProvider } from './HDWalletProvider';
import { PrivateKeyProvider } from './PrivateKeyProvider';

export const providers = (wasm: any) => ({
    HDWalletProvider: HDWalletProvider(wasm),
    PrivateKeyProvider: PrivateKeyProvider(wasm),
});
