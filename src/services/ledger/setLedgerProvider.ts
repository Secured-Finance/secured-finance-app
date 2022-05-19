import { Network } from '@glif/filecoin-address';
import Filecoin from '@glif/filecoin-wallet-provider';
import RustModule from '@zondax/filecoin-signing-tools';
import { AppDispatch } from 'src/store';
import {
    busy,
    establishingConnectionWithFilecoinApp,
    filecoinAppNotOpen,
    filecoinAppOpen,
    ledgerBadVersion,
    ledgerConnected,
    ledgerNotFound,
    lock,
    replug,
    unlock,
    usedByAnotherApp,
    userInitiatedImport,
    webUsbUnsupported,
} from 'src/store/ledger';
import { FIL_JSON_RPC_ENDPOINT } from '../filecoin';
import createLedgerProvider from '../filecoin/providers/LedgerProvider';
import badVersion, { IBadVersionProps } from './badVersion';
import createTransport from './createTransport';

type ResponseType = { device_locked: boolean } & IBadVersionProps;

export const setLedgerProvider = async (
    dispatch: AppDispatch,
    network: Network = Network.TEST
) => {
    const rustModule = (await import(
        '@zondax/filecoin-signing-tools'
    )) as RustModule;
    const LedgerProvider = createLedgerProvider(rustModule);
    dispatch(userInitiatedImport());
    try {
        const transport = await createTransport();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const provider = new Filecoin(LedgerProvider(transport), {
            apiAddress: FIL_JSON_RPC_ENDPOINT[network],
        });
        dispatch(ledgerConnected());
        return provider;
    } catch (err) {
        const e = err as Error;
        if (
            e.message &&
            e.message.includes('TRANSPORT NOT SUPPORTED BY DEVICE')
        ) {
            dispatch(webUsbUnsupported());
        } else if (
            e.message &&
            e.message.toLowerCase().includes('unable to claim interface.')
        ) {
            dispatch(usedByAnotherApp());
        } else if (
            e.message &&
            e.message.toLowerCase().includes('transporterror: invalid channel')
        ) {
            dispatch(replug());
        } else if (
            e.message &&
            e.message.toLowerCase().includes('no device selected')
        ) {
            dispatch(ledgerNotFound());
        }
        console.error(e);
        return false;
    }
};

export const checkLedgerConfiguration = async (
    dispatch: AppDispatch,
    walletProvider: Filecoin
) => {
    dispatch(establishingConnectionWithFilecoinApp());
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const response: ResponseType = await walletProvider.wallet.getVersion();
        if (response.device_locked) {
            dispatch(lock());
            return false;
        }

        if (badVersion({ ...response })) {
            dispatch(ledgerBadVersion());
            return false;
        }

        dispatch(unlock());
        dispatch(filecoinAppOpen(walletProvider));
        return true;
    } catch (err) {
        const e = err as Error;
        if (
            e.message &&
            e.message.toLowerCase().includes('transporterror: invalid channel')
        ) {
            dispatch(replug());
        } else if (
            e.message &&
            e.message.toLowerCase().includes('ledger device locked or busy')
        ) {
            dispatch(busy());
        } else if (
            e.message &&
            e.message.toLowerCase().includes('app does not seem to be open')
        ) {
            dispatch(filecoinAppNotOpen());
        } else {
            console.error(e);
            dispatch(replug());
        }
        return false;
    }
};
