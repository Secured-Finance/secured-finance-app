import { Network as FilNetwork } from '@glif/filecoin-address';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { providers } from '../../services/filecoin/providers';

export const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

export const Context = createContext({
    isLoaded: false,
});

interface FilecoinWalletProviderProps {
    children: ReactNode;
    ntwk?: FilNetwork.MAIN | FilNetwork.TEST;
}

const FilecoinWasmProvider: React.FC<FilecoinWalletProviderProps> = ({
    children,
    ntwk,
}) => {
    const [wasmModule, setWasmModule] = useState<any>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [filProviders, setFilProviders] = useState<any>();

    const { connect } = useWallet();

    useEffect(() => {
        const cachedProvider = localStorage.getItem(CACHED_PROVIDER_KEY);
        if (cachedProvider !== null) {
            connect('injected');
        }
    }, []);

    useEffect(() => {
        async function loadWasmModule() {
            try {
                const wasm = await import('@zondax/filecoin-signing-tools');
                await setWasmModule(wasm);
                await setLoaded(true);
                await setFilProviders(providers(wasm));
            } catch (err) {
                await setLoaded(false);
                console.error(
                    `Unexpected error in loadWasm. [Message: ${
                        (err as Error).message
                    }]`
                );
            }
        }
        loadWasmModule();
    }, [setWasmModule, setLoaded, setFilProviders, providers]);

    return (
        <Context.Provider
            value={{ ...wasmModule, loaded, filProviders, isLoaded: true }}
        >
            {children}
        </Context.Provider>
    );
};

export default FilecoinWasmProvider;
