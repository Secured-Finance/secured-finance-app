import { useMemo } from 'react';
import { getNonSubgraphSupportedChainIds } from 'src/utils';

export const useIsSubgraphSupported = (currentChainId: number) => {
    return useMemo(
        () => !getNonSubgraphSupportedChainIds().includes(currentChainId),
        [currentChainId]
    );
};
