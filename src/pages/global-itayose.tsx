import { useRouter } from 'next/router';
import { GlobalItayose as GlobalItayoseComponent } from 'src/components/pages';
import { useIsGlobalItayose } from 'src/hooks';

const GlobalItayose = () => {
    const { data: isGlobalItayose, isLoading: isLoadingGlobalItayose } =
        useIsGlobalItayose();

    const router = useRouter();

    if (isLoadingGlobalItayose) {
        return null;
    }

    if (!isGlobalItayose && typeof window !== 'undefined') {
        router.push('/');
        return null;
    }
    return <GlobalItayoseComponent />;
};

export default GlobalItayose;
