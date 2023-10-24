import ErrorPage from 'next/error';
import { EmergencyGlobalSettlement } from 'src/components/pages/';
import { useIsMarketTerminated } from 'src/hooks';

const Emergency = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (!isTerminated) return <ErrorPage statusCode={404} />;

    return <EmergencyGlobalSettlement />;
};

export default Emergency;
