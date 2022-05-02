import { Network } from '@glif/filecoin-address';
import Filecoin from '@glif/filecoin-wallet-provider';
import { Dispatch } from 'react';
import { FILSCAN_API_URL } from '../filecoin';
import createLedgerProvider from '../filecoin/providers/LedgerProvider';
import badVersion, { IBadVersionProps } from './badVersion';
import createTransport from './createTransport';
import {
    LEDGER_BAD_VERSION,
    LEDGER_BUSY,
    LEDGER_CONNECTED,
    LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP,
    LEDGER_FILECOIN_APP_NOT_OPEN,
    LEDGER_FILECOIN_APP_OPEN,
    LEDGER_LOCKED,
    LEDGER_NOT_FOUND,
    LEDGER_REPLUG,
    LEDGER_UNLOCKED,
    LEDGER_USED_BY_ANOTHER_APP,
    LEDGER_USER_INITIATED_IMPORT,
    WEBUSB_UNSUPPORTED,
} from './ledgerStateManagement';

type ResponseType = { device_locked: boolean } & IBadVersionProps;

export const setLedgerProvider = async (
    dispatch: Dispatch<{ type: string; payload?: any }>,
    network: Network = Network.TEST
) => {
    const rustModule = await import('@zondax/filecoin-signing-tools');
    const LedgerProvider = createLedgerProvider(rustModule);
    dispatch({ type: LEDGER_USER_INITIATED_IMPORT });
    try {
        const transport = await createTransport();
        // @ts-ignore
        const provider = new Filecoin(LedgerProvider(transport), {
            apiAddress: FILSCAN_API_URL[network],
        });
        dispatch({ type: LEDGER_CONNECTED });
        return provider;
    } catch (err) {
        const e = err as Error;
        if (
            e.message &&
            e.message.includes('TRANSPORT NOT SUPPORTED BY DEVICE')
        ) {
            dispatch({ type: WEBUSB_UNSUPPORTED });
        } else if (
            e.message &&
            e.message.toLowerCase().includes('unable to claim interface.')
        ) {
            dispatch({ type: LEDGER_USED_BY_ANOTHER_APP });
        } else if (
            e.message &&
            e.message.toLowerCase().includes('transporterror: invalid channel')
        ) {
            dispatch({ type: LEDGER_REPLUG });
        } else if (
            e.message &&
            e.message.toLowerCase().includes('no device selected')
        ) {
            dispatch({ type: LEDGER_NOT_FOUND });
        }
        console.log(e);
        return false;
    }
};

export const checkLedgerConfiguration = async (
    dispatch: Dispatch<{ type: string; payload?: any }>,
    walletProvider: any
) => {
    dispatch({ type: LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP });
    try {
        const response: ResponseType = await walletProvider.wallet.getVersion();
        if (response.device_locked) {
            dispatch({ type: LEDGER_LOCKED });
            return false;
        }

        if (badVersion({ ...response })) {
            dispatch({ type: LEDGER_BAD_VERSION });
            return false;
        }

        dispatch({ type: LEDGER_UNLOCKED });
        dispatch({ type: LEDGER_FILECOIN_APP_OPEN, payload: walletProvider });
        return true;
    } catch (err) {
        const e = err as Error;
        if (
            e.message &&
            e.message.toLowerCase().includes('transporterror: invalid channel')
        ) {
            dispatch({ type: LEDGER_REPLUG });
        } else if (
            e.message &&
            e.message.toLowerCase().includes('ledger device locked or busy')
        ) {
            dispatch({ type: LEDGER_BUSY });
        } else if (
            e.message &&
            e.message.toLowerCase().includes('app does not seem to be open')
        ) {
            dispatch({ type: LEDGER_FILECOIN_APP_NOT_OPEN });
        } else {
            console.log(e);
            dispatch({ type: LEDGER_REPLUG });
        }
        return false;
    }
};
