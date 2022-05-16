import { Network as FilNetwork } from '@glif/filecoin-address';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { providers } from 'src/services/filecoin/providers';

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
