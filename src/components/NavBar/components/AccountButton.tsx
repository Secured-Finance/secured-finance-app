import React, { useCallback } from 'react';
import useModal from 'src/hooks/useModal';
import WalletProviderModal from 'src/components/WalletProviderModal';
import { Button } from 'src/components/common/Buttons';
import { Link } from 'react-router-dom';
import { CACHED_PROVIDER_KEY } from 'src/contexts/FilecoinWalletProvider';
import { useSelector } from 'react-redux';
import { isAnyWalletConnected } from 'src/store/wallets/selectors';

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = props => {
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal ccyIndex={0} />,
        'provider'
    );

    const isAccountConnected = localStorage.getItem(CACHED_PROVIDER_KEY);
    const hasAnyWalletConnection = useSelector(isAnyWalletConnected);

    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal();
    }, [onPresentWalletProviderModal]);

    return (
        <div>
            {isAccountConnected || hasAnyWalletConnection ? (
                <Link to='/account'>
                    <Button outline size='sm'>
                        My Wallet
                    </Button>
                </Link>
            ) : (
                <Button size='sm' onClick={handleUnlockClick}>
                    Unlock Wallet
                </Button>
            )}
        </div>
    );
};

export default AccountButton;
