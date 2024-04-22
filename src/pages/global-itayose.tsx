import { useRouter } from 'next/router';
import { GlobalItayose as GlobalItayoseComponent } from 'src/components/pages';
import { useIsGlobalItayose } from 'src/hooks';

const GlobalItayose = () => {
    const { data: isGlobalItayose, isPending: isPendingGlobalItayose } =
        useIsGlobalItayose();

    const router = useRouter();

    if (isPendingGlobalItayose) {
        return null;
    }

    if (!isGlobalItayose) {
        router.push('/');
        return null;
    }
    return <GlobalItayoseComponent />;
};

export default GlobalItayose;
