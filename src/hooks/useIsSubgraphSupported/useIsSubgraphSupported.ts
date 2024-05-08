import { useMemo } from 'react';
import { getNonSubgraphSupportedChainIds } from 'src/utils';

export const useIsSubgraphSupported = (currentChainId?: number) => {
    return useMemo(
        () =>
            currentChainId &&
            !getNonSubgraphSupportedChainIds().includes(currentChainId),
        [currentChainId]
    );
};
