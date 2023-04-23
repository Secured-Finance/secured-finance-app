import { useCallback, useEffect, useState } from 'react';
import useSF from './useSecuredFinance';

export const useCollateralParameters = () => {
    const securedFinance = useSF();
    const [collateralThreshold, setCollateralThreshold] = useState(0);

    const fetchCollateralParameters = useCallback(async () => {
        try {
            if (!securedFinance) {
                return;
            }
            const params = await securedFinance.getCollateralParameters();
            if (params && !params.liquidationThresholdRate.isZero()) {
                setCollateralThreshold(
                    1000000 / params.liquidationThresholdRate.toNumber()
                );
            }
        } catch (error) {
            console.error(error);
        }
    }, [securedFinance]);

    useEffect(() => {
        if (securedFinance) {
            fetchCollateralParameters();
        }
    }, [fetchCollateralParameters, securedFinance]);

    return collateralThreshold;
};
