import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { useRuntimeConfig } from '../useRuntimeConfig';

export const MAINTENANCE_LABEL = 'Paused for maintenance';

// True when trading on the selected chain is paused through the runtime config.
// A failed refetch keeps the last config, so the pause stays on.
export const useIsUnderMaintenance = () => {
    const { maintenanceChainIds } = useRuntimeConfig();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    return maintenanceChainIds.includes(chainId);
};
