import { useRouter } from 'next/router';
import { EmergencyGlobalSettlement } from 'src/components/pages/';
import { useIsMarketTerminated } from 'src/hooks';

const Emergency = () => {
    const router = useRouter();
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();

    if (isPendingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        return <EmergencyGlobalSettlement />;
    }

    return router.push('/');
};

export default Emergency;
