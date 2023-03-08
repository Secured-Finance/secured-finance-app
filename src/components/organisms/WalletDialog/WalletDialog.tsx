import { track } from '@amplitude/analytics-browser';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'src/assets/img/gradient-loader.png';
import MetaMaskIcon from 'src/assets/img/metamask-fox.svg';
import WalletConnectIcon from 'src/assets/img/wallet-connect.svg';
import {
    Dialog,
    SuccessPanel,
    WalletRadioGroup,
} from 'src/components/molecules';
import { CACHED_PROVIDER_KEY } from 'src/contexts/SecuredFinanceProvider/SecuredFinanceProvider';
import { setWalletDialogOpen } from 'src/store/interactions';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    InterfaceEvents,
    InterfaceProperties,
    WalletConnectionResult,
} from 'src/utils';
import { associateWallet } from 'src/utils/events';
import { useWallet } from 'use-wallet';

enum Step {
    selectWallet = 1,
    connecting,
    connected,
}

type State = {
    currentStep: Step;
    nextStep: Step;
    title: string;
    description: string;
    buttonText: string;
};

const stateRecord: Record<Step, State> = {
    [Step.selectWallet]: {
        currentStep: Step.selectWallet,
        nextStep: Step.connecting,
        title: 'Select Wallet Provider',
        description:
            'Connect your wallet to unlock and start using services on Secured Finance.',
        buttonText: 'Connect Wallet',
    },
    [Step.connecting]: {
        currentStep: Step.connecting,
        nextStep: Step.connected,
        title: 'Connecting...',
        description: '',
        buttonText: '',
    },
    [Step.connected]: {
        currentStep: Step.connected,
        nextStep: Step.selectWallet,
        title: 'Success!',
        description: 'Your wallet has been connected successfully.',
        buttonText: 'OK',
    },
};

const reducer = (
    state: State,
    action: {
        type: string;
    }
) => {
    switch (action.type) {
        case 'next':
            return {
                ...stateRecord[state.nextStep],
            };
        default:
            return {
                ...stateRecord[Step.selectWallet],
            };
    }
};

export const WalletDialog = () => {
    const [wallet, setWallet] = useState<string>('');
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const isOpen = useSelector(
        (state: RootState) => state.interactions.walletDialogOpen
    );
    const globalDispatch = useDispatch();

    const { account, connect } = useWallet();

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        globalDispatch(setWalletDialogOpen(false));
    }, [globalDispatch]);

    const handleConnect = useCallback(
        async (
            provider: 'injected' | 'walletconnect',
            account: string | null
        ) => {
            if (!account) {
                await connect(provider);
                localStorage.setItem(CACHED_PROVIDER_KEY, 'connected');
            } else {
                dispatch({ type: 'next' });
            }
        },
        [connect, dispatch]
    );

    useEffect(() => {
        if (state.currentStep === Step.connecting) {
            const provider =
                wallet === 'Metamask' ? 'injected' : 'walletconnect';
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
                .catch(() => {
                    track(InterfaceEvents.CONNECT_WALLET_BUTTON_CLICKED, {
                        [InterfaceProperties.WALLET_CONNECTION_RESULT]:
                            WalletConnectionResult.FAILED,
                    });
                });
        }
    }, [state, account, handleConnect, wallet]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            if (!wallet) {
                return;
            }

            switch (currentStep) {
                case Step.selectWallet:
                    dispatch({ type: 'next' });
                    break;
                case Step.connecting:
                    break;
                case Step.connected:
                    handleClose();
                    break;
            }
        },
        [handleClose, wallet]
    );

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={state.title}
            description={state.description}
            callToAction={state.buttonText}
            onClick={() => onClick(state.currentStep)}
        >
            {(() => {
                switch (state.currentStep) {
                    case Step.selectWallet:
                        return (
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
                        );
                    case Step.connecting:
                        return (
                            <div className='py-9'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={Loader.src}
                                    alt='Loader'
                                    className='animate-spin'
                                ></img>
                            </div>
                        );
                        break;
                    case Step.connected:
                        return (
                            <SuccessPanel
                                itemList={[
                                    ['Status', 'Connected'],
                                    [
                                        'Ethereum Address',
                                        AddressUtils.format(account ?? '', 16),
                                    ],
                                ]}
                            />
                        );
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
