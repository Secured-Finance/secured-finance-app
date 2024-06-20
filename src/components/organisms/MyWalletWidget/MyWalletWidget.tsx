import { MyWalletCard } from 'src/components/molecules';
import { ConnectWalletCard } from 'src/components/organisms';
import { useCurrencies } from 'src/hooks';
import { WalletSource } from 'src/utils';
import { useAccount } from 'wagmi';

export const MyWalletWidget = () => {
    const { address, isConnected } = useAccount();
    const { data: currencies = [] } = useCurrencies(true);
    const walletInformation = {
        [WalletSource.METAMASK]: currencies,
    };

    if (!isConnected) return <ConnectWalletCard />;

    return (
        <MyWalletCard
            addressRecord={{
                [WalletSource.METAMASK]: address,
            }}
            information={walletInformation}
        />
    );
};
