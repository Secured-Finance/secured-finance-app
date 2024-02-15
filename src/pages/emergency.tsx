import Router from 'next/router';
import { EmergencyGlobalSettlement } from 'src/components/pages/';
import { useIsMarketTerminated } from 'src/hooks';

const Emergency = () => {
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    if (isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        return <EmergencyGlobalSettlement />;
    }

    Router.push('/');
    return null;
};

export default Emergency;
