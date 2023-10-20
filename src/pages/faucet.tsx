import Router from 'next/router';
import { Faucet as FaucetComponent } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Faucet = () => {
    const { data: isTerminated } = useIsMarketTerminated();

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    return <FaucetComponent />;
};

export default Faucet;
