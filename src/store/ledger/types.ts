import Filecoin from '@glif/filecoin-wallet-provider';
import { ILedger } from 'src/services/ledger/ledgerStateManagement';

export interface LedgerStore {
    walletType: string;
    walletProvider: Filecoin | null;
    error: string;
    ledger: ILedger;
}
