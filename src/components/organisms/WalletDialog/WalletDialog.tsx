import { track } from '@amplitude/analytics-browser';
import { useCallback, useMemo, useState } from 'react';
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
import { useEtherscanUrl } from 'src/hooks';
import { setWalletDialogOpen } from 'src/store/interactions';
import { RootState } from 'src/store/types';
import { Wallet } from 'src/types';
import {
    AddressUtils,
    InterfaceEvents,
    InterfaceProperties,
    WalletConnectionResult,
    getSupportedChainIds,
    getSupportedNetworks,
    writeWalletInStore,
} from 'src/utils';
import { associateWallet } from 'src/utils/events';
import { useAccount, useConnect } from 'wagmi';

function hasMetaMask() {
    if (typeof window === 'undefined') {
        return false;
    }
    return typeof window.ethereum !== 'undefined';
}

export const WalletDialog = () => {
    const etherscanUrl = useEtherscanUrl();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);

    const chainName = getSupportedNetworks().find(n => n.id === chainId)?.name;

    const options = useMemo(() => {
        const options = [
            {
                name: 'Metamask',
                Icon: MetaMaskIcon,
            },
            {
                name: 'WalletConnect',
                Icon: WalletConnectIcon,
            },
        ];
        if (!hasMetaMask()) {
            return options.slice(1, 2);
        }
        return options;
    }, []);

    const [wallet, setWallet] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState(
        'Your wallet could not be connected.'
    );

    const isOpen = useSelector(
        (state: RootState) => state.interactions.walletDialogOpen
    );
    const dispatch = useDispatch();

    const { connect, connectors, isLoading, isSuccess, isError, reset } =
        useConnect({
            onSettled(data, error) {
                if (error) {
                    track(InterfaceEvents.CONNECT_WALLET_BUTTON_CLICKED, {
                        [InterfaceProperties.CHAIN]: chainName,
                        [InterfaceProperties.WALLET_CONNECTION_RESULT]:
                            WalletConnectionResult.FAILED,
                        [InterfaceProperties.WALLET_CONNECTOR]:
                            data?.connector?.name,
                    });
                    setErrorMessage(error.message);
                } else {
                    track(InterfaceEvents.CONNECT_WALLET_BUTTON_CLICKED, {
                        [InterfaceProperties.CHAIN]: chainName,
                        [InterfaceProperties.WALLET_CONNECTION_RESULT]:
                            WalletConnectionResult.SUCCEEDED,
                        [InterfaceProperties.WALLET_CONNECTOR]:
                            data?.connector?.name,
                        [InterfaceProperties.WALLET_ADDRESS]: data?.account,
                    });
                    if (data?.account)
                        associateWallet(data.account, true, chainName);
                }
            },
        });
    const { address, isConnected } = useAccount();

    const handleClose = useCallback(() => {
        dispatch(setWalletDialogOpen(false));
        reset();
    }, [dispatch, reset]);

    const handleConnect = useCallback(
        async (provider: Wallet, account: string | undefined) => {
            const connector = connectors.find(
                connect => connect.name === provider
            );

            if (!connector) {
                setErrorMessage('Provider not found.');
                return;
            }

            if (!account) {
                const supportedChainId = getSupportedChainIds();
                if (
                    provider === 'MetaMask' &&
                    hasMetaMask() &&
                    !supportedChainId.includes(await connector.getChainId())
                ) {
                    await connector.switchChain?.(supportedChainId[0]);
                }
                connect({ connector: connector });
                writeWalletInStore(provider);
            }
        },
        [connect, connectors]
    );

    const connectWallet = useCallback(
        async (address: string | undefined) => {
            try {
                const provider =
                    wallet === 'Metamask' ? 'MetaMask' : 'WalletConnect';
                await handleConnect(provider, address);
            } catch (e) {
                reset();
            }
        },
        [handleConnect, reset, wallet]
    );

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
        } else if (isSuccess && address) {
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
            showCancelButton={!isConnected && !isLoading && !isError}
            onClick={async () => {
                if (!isConnected && !isLoading && !isError) {
                    await connectWallet(address);
                } else {
                    handleClose();
                }
            }}
        >
            <>
                {!isConnected && !isLoading && !isError && (
                    <WalletRadioGroup
                        value={wallet}
                        onChange={setWallet}
                        options={options}
                    />
                )}
                {isLoading && (
                    <div className='flex h-full w-full items-center justify-center py-9'>
                        <Spinner />
                    </div>
                )}
                {isSuccess && address && (
                    <SuccessPanel
                        itemList={[
                            ['Status', 'Connected'],
                            [
                                'Ethereum Address',
                                AddressUtils.format(address ?? '', 8),
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
