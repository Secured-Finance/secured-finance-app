import { Network as FilNetwork } from '@glif/filecoin-address';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { providers } from 'src/services/filecoin/providers';
import { useWallet } from 'use-wallet';

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
        // TODO: understand why adding connect in the dependencies makes the app crash
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        async function loadWasmModule() {
            try {
                const wasm = await import('@zondax/filecoin-signing-tools');
                setWasmModule(wasm);
                setLoaded(true);
                setFilProviders(providers(wasm));
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
            value={{ ...wasmModule, loaded, filProviders, isLoaded: true }}
        >
            {children}
        </Context.Provider>
    );
};

export default FilecoinWasmProvider;
