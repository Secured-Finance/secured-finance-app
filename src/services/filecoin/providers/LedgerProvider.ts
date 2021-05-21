import FilecoinApp from '@zondax/ledger-filecoin';
import RustModule from '@zondax/filecoin-signing-tools';
import Transport from '@ledgerhq/hw-transport';
import { mapSeries } from 'bluebird';
import {
    MAINNET,
    MAINNET_PATH_CODE,
    TESTNET_PATH_CODE,
    LEDGER,
} from '../../ledger/constants';
import createPath from '../../ledger/createPath';

type Response = {
    error_message: string;
    signature_compact?: Buffer;
    addrString?: string;
};

const handleErrors: (response: Response) => Response = response => {
    if (
        response.error_message &&
        response.error_message.toLowerCase().includes('no errors')
    ) {
        return response;
    }
    if (
        response.error_message &&
        response.error_message
            .toLowerCase()
            .includes('transporterror: invalid channel')
    ) {
        throw new Error(
            'Lost connection with Ledger. Please quit the Filecoin app, and unplug/replug device.'
        );
    }
    throw new Error(response.error_message);
};

const ledgerProvider = (rustModule: RustModule) => {
    return (transport: Transport) => {
        const ledgerApp = new FilecoinApp(transport);
        return {
            type: LEDGER,

            getVersion: async () => {
                let finished = false;

                try {
                    return handleErrors(await ledgerApp.getVersion());
                } catch (err) {
                    return err;
                } finally {
                    if (!finished) {
                        finished = true;
                    }
                }
            },

            getAccounts: async (
                nStart = 0,
                nEnd = 5,
                network: string = MAINNET
            ) => {
                const networkCode =
                    network === MAINNET ? MAINNET_PATH_CODE : TESTNET_PATH_CODE;
                const paths = [];
                for (let i = nStart; i < nEnd; i += 1) {
                    paths.push(createPath(networkCode, i));
                }
                return mapSeries(paths, async path => {
                    const { addrString } = handleErrors(
                        await ledgerApp.getAddressAndPubKey(path)
                    );
                    return addrString;
                });
            },

            sign: async (filecoinMessage: string, path: string) => {
                const serializedMessage: string =
                    rustModule.transactionSerialize(filecoinMessage);
                const res = handleErrors(
                    await ledgerApp.sign(
                        path,
                        Buffer.from(serializedMessage, 'hex')
                    )
                );
                return res.signature_compact.toString('base64');
            },

            showAddressAndPubKey: async (path: string) => {
                return handleErrors(await ledgerApp.showAddressAndPubKey(path));
            },
        };
    };
};

export default ledgerProvider;
