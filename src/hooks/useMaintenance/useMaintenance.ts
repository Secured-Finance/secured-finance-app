import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { useRuntimeConfig } from '../useRuntimeConfig';

export const MAINTENANCE_LABEL = 'Paused for maintenance';

// It blocks new orders in the app (Place Order and Add/Reduce). Cancel, close, repay
// and redeem stay enabled: when the contracts are running they let users reduce risk,
// and when the contracts are paused the transaction is rejected on-chain.
export const useIsUnderMaintenance = () => {
    const { maintenanceChainIds } = useRuntimeConfig();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    return maintenanceChainIds.includes(chainId);
};
