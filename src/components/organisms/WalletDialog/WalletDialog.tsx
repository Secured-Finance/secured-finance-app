import { track } from '@amplitude/analytics-browser';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetaMaskIcon from 'src/assets/img/metamask-fox.svg';
import WalletConnectIcon from 'src/assets/img/wallet-connect.svg';
import { Spinner } from 'src/components/atoms';
import {
    Dialog,
    FailurePanel,
    SuccessPanel,
    WalletRadioGroup,
} from 'src/components/molecules';
import { CACHED_PROVIDER_KEY } from 'src/contexts/SecuredFinanceProvider/SecuredFinanceProvider';
import { useEtherscanUrl } from 'src/hooks';
import { setWalletDialogOpen } from 'src/store/interactions';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    InterfaceEvents,
    InterfaceProperties,
    WalletConnectionResult,
    decToHex,
    getEthereumChainId,
} from 'src/utils';
import { associateWallet } from 'src/utils/events';
import { useAccount, useConnect } from 'wagmi';

export const WalletDialog = () => {
    const etherscanUrl = useEtherscanUrl();
    const [wallet, setWallet] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState(
        'Your wallet could not be connected.'
    );

    const isOpen = useSelector(
        (state: RootState) => state.interactions.walletDialogOpen
    );
    const globalDispatch = useDispatch();

    const { connect, connectors, isLoading, isSuccess, isError, reset } =
        useConnect();
    const { address: account, isConnected } = useAccount();

    const handleClose = useCallback(() => {
        globalDispatch(setWalletDialogOpen(false));
    }, [globalDispatch]);

    const handleConnect = useCallback(
        async (
            provider: 'MetaMask' | 'WalletConnect',
            account: string | undefined
        ) => {
            const connector = connectors.find(
                connect => connect.name === provider
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const injected = (window as any).ethereum;
            if (injected && injected?.request) {
                try {
                    await injected?.request({
                        method: 'wallet_switchEthereumChain',
                        params: [
                            {
                                chainId: decToHex(getEthereumChainId()),
                            },
                        ],
                    });
                } catch (e) {
                    if (e instanceof Error) {
                        setErrorMessage(e.message);
                    }
                }
            }

            if (!connector) {
                setErrorMessage('Provider not found.');
                return;
            }

            try {
                if (!account && connector && connector.name === provider) {
                    connect({ connector: connector });
                    localStorage.setItem(CACHED_PROVIDER_KEY, connector.name);
                }
            } catch (e) {
                if (e instanceof Error) {
                    setErrorMessage(e.message);
                }
            }
        },
        [connect, connectors]
    );

    const connectWallet = useCallback(() => {
        const provider = wallet === 'Metamask' ? 'MetaMask' : 'WalletConnect';

        handleConnect(provider, account)
            .then(() => {
                if (!account) return;
                track(InterfaceEvents.CONNECT_WALLET_BUTTON_CLICKED, {
                    [InterfaceProperties.WALLET_CONNECTION_RESULT]:
                        WalletConnectionResult.SUCCEEDED,
                    [InterfaceProperties.WALLET_ADDRESS]: account,
                });
                associateWallet(account);
            })
            .catch(e => {
                track(InterfaceEvents.CONNECT_WALLET_BUTTON_CLICKED, {
                    [InterfaceProperties.WALLET_CONNECTION_RESULT]:
                        WalletConnectionResult.FAILED,
                });
                if (e instanceof Error) {
                    setErrorMessage(e.message);
                }
            });
    }, [account, handleConnect, wallet]);

    const dialogText = () => {
        if (!isConnected && !isLoading && !isError) {
            return {
                title: 'Select Wallet Provider',
                description:
                    'Connect your wallet to unlock and start using services on Secured Finance.',
                buttonText: 'Connect Wallet',
            };
        } else if (isLoading) {
            return {
                title: 'Connecting...',
                description: '',
                buttonText: '',
            };
        } else if (isSuccess && account) {
            return {
                title: 'Success!',
                description: 'Your wallet has been connected successfully.',
                buttonText: 'OK',
            };
        }
        return {
            title: 'Failed!',
            description: '',
            buttonText: 'OK',
        };
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={dialogText().title}
            description={dialogText().description}
            callToAction={dialogText().buttonText}
            onClick={() => {
                if (!isConnected && !isLoading && !isError) connectWallet();
                else {
                    reset();
                    handleClose();
                }
            }}
        >
            <>
                {!isConnected && !isLoading && !isError && (
                    <WalletRadioGroup
                        value={wallet}
                        onChange={setWallet}
                        options={[
                            {
                                name: 'Metamask',
                                Icon: MetaMaskIcon,
                            },
                            {
                                name: 'WalletConnect',
                                Icon: WalletConnectIcon,
                            },
                        ]}
                    />
                )}
                {isLoading && (
                    <div className='flex h-full w-full items-center justify-center py-9'>
                        <Spinner />
                    </div>
                )}
                {isSuccess && account && (
                    <SuccessPanel
                        itemList={[
                            ['Status', 'Connected'],
                            [
                                'Ethereum Address',
                                AddressUtils.format(account ?? '', 16),
                            ],
                        ]}
                        etherscanUrl={etherscanUrl}
                    />
                )}
                {isError && <FailurePanel errorMessage={errorMessage} />}
            </>
        </Dialog>
    );
};
