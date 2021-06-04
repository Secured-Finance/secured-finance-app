import { FilecoinNumber } from '@glif/filecoin-number';

export const LEDGER = 'LEDGER';

/* FILECOIN APP VERSION MIN */
export const LEDGER_VERSION_MAJOR = 0;
export const LEDGER_VERSION_MINOR = 18;
export const LEDGER_VERSION_PATCH = 2;

/* NETWORK VARS */
export const MAINNET = 'f';

export const MAINNET_PATH_CODE = 461;
export const TESTNET_PATH_CODE = 1;

/* GAS CONSTANTS */
export const emptyGasInfo = {
    estimatedTransactionFee: new FilecoinNumber('0', 'attofil'),
    gasPremium: new FilecoinNumber('0', 'attofil'),
    gasFeeCap: new FilecoinNumber('0', 'attofil'),
    gasLimit: new FilecoinNumber('0', 'attofil'),
};

/* MESSAGE ERROR TEXTS */

export const insufficientMsigFundsErr =
    'The Signing account on your Ledger device does not have sufficient funds to pay this transaction fee.';
export const insufficientSendFundsErr =
    'This account does not have enough FIL to pay for this transaction + the transaction fee.';

/* TX METHOD TYPES */
export const SEND = 'SEND';
export const PROPOSE = 'PROPOSE';
export const EXEC = 'EXEC';
