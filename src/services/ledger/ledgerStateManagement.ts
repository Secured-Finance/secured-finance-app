import PropTypes from 'prop-types';
export interface ILedger {
    userImportFailure: boolean;
    connecting: boolean;
    connectedFailure: boolean;
    locked: boolean;
    unlocked: boolean;
    busy: boolean;
    filecoinAppNotOpen: boolean;
    replug: boolean;
    inUseByAnotherApp: boolean;
    badVersion: boolean;
    webUSBSupported: boolean;
}

export const initialLedgerState: ILedger = {
    userImportFailure: false,
    connecting: false,
    connectedFailure: false,
    locked: false,
    unlocked: false,
    busy: false,
    filecoinAppNotOpen: false,
    replug: false,
    inUseByAnotherApp: false,
    badVersion: false,
    // true until proven otherwise
    webUSBSupported: true,
};

export const LEDGER_STATE_PROPTYPES = {
    userImportFailure: PropTypes.bool.isRequired,
    connecting: PropTypes.bool.isRequired,
    connectedFailure: PropTypes.bool.isRequired,
    locked: PropTypes.bool.isRequired,
    unlocked: PropTypes.bool.isRequired,
    busy: PropTypes.bool.isRequired,
    filecoinAppNotOpen: PropTypes.bool.isRequired,
    badVersion: PropTypes.bool.isRequired,
    webUSBSupported: PropTypes.bool.isRequired,
};
