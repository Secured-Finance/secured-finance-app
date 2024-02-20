import { useRouter } from 'next/router';
import { EmergencyGlobalSettlement } from 'src/components/pages/';
import { useIsMarketTerminated } from 'src/hooks';

const Emergency = () => {
    const router = useRouter();
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    if (isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        return <EmergencyGlobalSettlement />;
    }

    if (typeof window !== 'undefined') {
        router.push('/');
    }

    return null;
};

export default Emergency;
