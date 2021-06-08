import Filecoin from '@glif/filecoin-wallet-provider';
import {
    LEDGER_USER_INITIATED_IMPORT,
    LEDGER_CONNECTED,
    LEDGER_NOT_FOUND,
    LEDGER_REPLUG,
    LEDGER_LOCKED,
    LEDGER_UNLOCKED,
    LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP,
    LEDGER_FILECOIN_APP_NOT_OPEN,
    LEDGER_FILECOIN_APP_OPEN,
    LEDGER_BUSY,
    LEDGER_USED_BY_ANOTHER_APP,
    WEBUSB_UNSUPPORTED,
    LEDGER_BAD_VERSION,
} from './ledgerStateManagement';
import createTransport from './createTransport';
import badVersion, { IBadVersionProps } from './badVersion';
import { Dispatch } from 'react';
import createLedgerProvider from '../filecoin/providers/LedgerProvider';
import { Network } from '@glif/filecoin-address';

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
            apiAddress:
                network === Network.MAIN
                    ? 'http://api.node.glif.io/rpc/v0'
                    : 'https://calibration.node.glif.io/rpc/v0',
        });
        dispatch({ type: LEDGER_CONNECTED });
        return provider;
    } catch (err) {
        if (
            err.message &&
            err.message.includes('TRANSPORT NOT SUPPORTED BY DEVICE')
        ) {
            dispatch({ type: WEBUSB_UNSUPPORTED });
        } else if (
            err.message &&
            err.message.toLowerCase().includes('unable to claim interface.')
        ) {
            dispatch({ type: LEDGER_USED_BY_ANOTHER_APP });
        } else if (
            err.message &&
            err.message
                .toLowerCase()
                .includes('transporterror: invalid channel')
        ) {
            dispatch({ type: LEDGER_REPLUG });
        } else if (
            err.message &&
            err.message.toLowerCase().includes('no device selected')
        ) {
            dispatch({ type: LEDGER_NOT_FOUND });
        }
        console.log(err);
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
        if (
            err.message &&
            err.message
                .toLowerCase()
                .includes('transporterror: invalid channel')
        ) {
            dispatch({ type: LEDGER_REPLUG });
        } else if (
            err.message &&
            err.message.toLowerCase().includes('ledger device locked or busy')
        ) {
            dispatch({ type: LEDGER_BUSY });
        } else if (
            err.message &&
            err.message.toLowerCase().includes('app does not seem to be open')
        ) {
            dispatch({ type: LEDGER_FILECOIN_APP_NOT_OPEN });
        } else {
            console.log(err);
            dispatch({ type: LEDGER_REPLUG });
        }
        return false;
    }
};
