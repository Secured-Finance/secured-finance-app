import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import useModal from '../../../hooks/useModal';
import WalletProviderModal from '../../WalletProviderModal';
import { Button } from '../../common/Buttons';
import { Link } from 'react-router-dom';
import { CACHED_PROVIDER_KEY } from '../../../contexts/FilecoinWalletProvider';

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = props => {
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal ccyIndex={0} />,
        'provider'
    );

    const { account } = useWallet();
    const isAccountConnected = localStorage.getItem(CACHED_PROVIDER_KEY);

    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal();
    }, [onPresentWalletProviderModal]);

    return (
        <StyledAccountButton>
            {!isAccountConnected ? (
                <Button size='sm' onClick={handleUnlockClick}>
                    Unlock Wallet
                </Button>
            ) : (
                <Link to='/account'>
                    <Button outline size='sm'>
                        My Wallet
                    </Button>
                </Link>
            )}
        </StyledAccountButton>
    );
};

const StyledAccountButton = styled.div``;

export default AccountButton;
