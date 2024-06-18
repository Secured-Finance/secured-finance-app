import { useRouter } from 'next/router';
import { Campaign as CampaignComponent } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Campaign = () => {
    const router = useRouter();
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();

    if (isPendingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        router.push('/emergency');
        return null;
    }

    return <CampaignComponent />;
};

export default Campaign;
