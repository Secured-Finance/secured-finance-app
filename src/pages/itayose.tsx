import Router from 'next/router';
import { Itayose as ItayoseComponent } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Itayose = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    return <ItayoseComponent />;
};

export default Itayose;
