import { MyWalletCard } from 'src/components/molecules';
import { ConnectWalletCard } from 'src/components/organisms';
import { WalletSource } from 'src/utils';
import { useAccount } from 'wagmi';

export const MyWalletWidget = ({
    hideBridge = false,
}: {
    hideBridge?: boolean;
}) => {
    const { address, isConnected } = useAccount();

    if (!isConnected) return <ConnectWalletCard />;

    return (
        <MyWalletCard
            addressRecord={{
                [WalletSource.METAMASK]: address,
            }}
            hideBridge={hideBridge}
        />
    );
};
