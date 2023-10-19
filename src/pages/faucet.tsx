import ErrorPage from 'next/error';
import { Faucet as FaucetComponent } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Faucet = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) return <ErrorPage statusCode={404} />;

    return <FaucetComponent />;
};

export default Faucet;
