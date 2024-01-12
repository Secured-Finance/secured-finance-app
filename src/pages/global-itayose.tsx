import Router from 'next/router';
import { GlobalItayose as GlobalItayoseComponent } from 'src/components/pages';
import { useIsGlobalItayose } from 'src/hooks';

const GlobalItayose = () => {
    const { data: isGlobalItayose, isLoading: isLoadingGlobalItayose } =
        useIsGlobalItayose();

    if (isLoadingGlobalItayose) {
        return null;
    }

    if (!isGlobalItayose) {
        Router.push('/');
        return null;
    }
    return <GlobalItayoseComponent />;
};

export default GlobalItayose;
