import ErrorPage from 'next/error';
import { Itayose as ItayoseComponent } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Itayose = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) return <ErrorPage statusCode={404} />;

    return <ItayoseComponent />;
};

export default Itayose;
