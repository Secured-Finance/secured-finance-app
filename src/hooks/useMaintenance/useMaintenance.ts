import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { useRuntimeConfig } from '../useRuntimeConfig';

export const MAINTENANCE_LABEL = 'Paused for maintenance';

// True when new orders on the selected chain are paused through the runtime config.
// It blocks new orders in the app only (Place Order and Add/Reduce) and does not
// pause the contracts: open orders can still be filled and liquidations still run,
// so cancel, close, repay, redeem, deposit and withdraw stay available.
// A failed refetch keeps the last config, so the pause stays on.
export const useIsUnderMaintenance = () => {
    const { maintenanceChainIds } = useRuntimeConfig();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    return maintenanceChainIds.includes(chainId);
};
