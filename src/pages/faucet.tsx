import Router from 'next/router';
import { Faucet as FaucetComponent } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';
import { isProdEnv } from 'src/utils';

const Faucet = () => {
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    if (isProdEnv()) {
        return null;
    }

    if (isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    return <FaucetComponent />;
};

export default Faucet;
