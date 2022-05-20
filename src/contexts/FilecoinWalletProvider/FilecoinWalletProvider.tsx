import RustModule from '@zondax/filecoin-signing-tools';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { providers, WalletProviders } from 'src/services/filecoin/providers';

const initialContext: {
    isLoaded: boolean;
    loaded: boolean;
    wasmModule: RustModule;
    filProviders: WalletProviders;
} = {
    isLoaded: false,
    loaded: false,
    filProviders: null,
    wasmModule: null,
};
export const Context = createContext(initialContext);

const FilecoinWasmProvider = ({ children }: { children: ReactNode }) => {
    const [wasmModule, setWasmModule] = useState<RustModule>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [filProviders, setFilProviders] = useState<WalletProviders>(null);

    useEffect(() => {
        async function loadWasmModule() {
            try {
                const wasm = await import('@zondax/filecoin-signing-tools');
                setWasmModule(wasm as RustModule);
                setLoaded(true);
                setFilProviders(providers(wasm as RustModule));
            } catch (err) {
                setLoaded(false);
                console.error(
                    `Unexpected error in loadWasm. [Message: ${
                        (err as Error).message
                    }]`
                );
            }
        }
        loadWasmModule();
    }, [setWasmModule, setLoaded, setFilProviders]);

    return (
        <Context.Provider
            value={{ wasmModule, loaded, filProviders, isLoaded: true }}
        >
            {children}
        </Context.Provider>
    );
};

export default FilecoinWasmProvider;
