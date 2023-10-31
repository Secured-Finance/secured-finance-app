import ErrorPage from 'next/error';
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

    return <ErrorPage statusCode={404} />;
};

export default Emergency;
