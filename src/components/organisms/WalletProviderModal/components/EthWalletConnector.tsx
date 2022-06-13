import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import metamaskLogo from 'src/assets/img/metamask-fox.svg';
import walletConnectLogo from 'src/assets/img/wallet-connect.svg';
import { ModalProps, Spacer } from 'src/components/atoms';
import { CACHED_PROVIDER_KEY } from 'src/contexts/SecuredFinanceProvider/SecuredFinanceProvider';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import WalletCard from './WalletCard';

const EthWalletConnector: React.FC<ModalProps> = ({ onDismiss }) => {
    const { account, connect } = useWallet();
    const history = useHistory();

    const handleConnect = useCallback(
        async (
            provider:
                | 'authereum'
                | 'fortmatic'
                | 'frame'
                | 'injected'
                | 'portis'
                | 'squarelink'
                | 'provided'
                | 'torus'
                | 'walletconnect'
                | 'walletlink',
            account: string
        ) => {
            if (!account) {
                await connect(provider);
                localStorage.setItem(CACHED_PROVIDER_KEY, 'connected');

                onDismiss();
                history.push('/account');
            }
        },
        [connect, onDismiss, history]
    );

    return (
        <StyledWalletsWrapper data-cy='eth-wallet'>
            <StyledWalletCard>
                <WalletCard
                    icon={
                        <img
                            src={metamaskLogo}
                            style={{ height: 32 }}
                            alt='Metamask'
                        />
                    }
                    onConnect={() => handleConnect('injected', account)}
                    title='Metamask'
                />
            </StyledWalletCard>
            <Spacer size='sm' />
            <StyledWalletCard>
                <WalletCard
                    icon={
                        <img
                            src={walletConnectLogo}
                            style={{ height: 24 }}
                            alt='Wallet Connect'
                        />
                    }
                    onConnect={() => handleConnect('walletconnect', account)}
                    title='WalletConnect'
                />
            </StyledWalletCard>
        </StyledWalletsWrapper>
    );
};

const StyledWalletsWrapper = styled.div`
    display: flex;
    @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
        flex-direction: column;
        flex-wrap: none;
    }
`;

const StyledWalletCard = styled.div`
    flex-basis: calc(50% - ${props => props.theme.spacing[2] / 2}px);
`;

export default EthWalletConnector;
