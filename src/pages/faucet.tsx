import Router from 'next/router';
import { Faucet as FaucetComponent } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';
import { isProdEnv } from 'src/utils';

const Faucet = () => {
    if (!isProdEnv()) {
        return null;
    }

    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsMarketTerminated();

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
