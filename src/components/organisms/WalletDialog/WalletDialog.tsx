import { useCallback, useEffect, useReducer, useState } from 'react';
import Check from 'src/assets/icons/check-mark.svg';
import Loader from 'src/assets/img/gradient-loader.png';
import { Dialog, WalletRadioGroup } from 'src/components/molecules';
import { CACHED_PROVIDER_KEY } from 'src/contexts/SecuredFinanceProvider/SecuredFinanceProvider';
import { useWallet } from 'use-wallet';

enum step {
    selectWallet = 1,
    connecting,
    connected,
}

type State = {
    currentStep: step;
    nextStep: step;
    title: string;
    description: string;
    buttonText: string;
};

const stateRecord: Record<step, State> = {
    [step.selectWallet]: {
        currentStep: step.selectWallet,
        nextStep: step.connecting,
        title: 'Select Wallet Provider',
        description:
            'Connect your wallet to unlock and start using services on Secured Finance',
        buttonText: 'Connect Wallet',
    },
    [step.connecting]: {
        currentStep: step.connecting,
        nextStep: step.connected,
        title: 'Connecting...',
        description:
            'Please wait while we connect. Please make sure to accept the approvals on your browser',
        buttonText: '',
    },
    [step.connected]: {
        currentStep: step.connected,
        nextStep: step.selectWallet,
        title: 'Success!',
        description: 'Your wallet has been connected successfully',
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
                ...stateRecord[step.selectWallet],
            };
    }
};

export const WalletDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [wallet, setWallet] = useState<string>('');
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);

    const { account, connect } = useWallet();

    const handleConnect = useCallback(
        async (provider: 'injected' | 'walletconnect', account: string) => {
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
        if (state.currentStep === step.connecting) {
            const provider =
                wallet === 'Metamask' ? 'injected' : 'walletconnect';
            handleConnect(provider, account);
        }
    }, [state, account, handleConnect, wallet]);

    const onClick = useCallback(
        async (currentStep: step) => {
            if (!wallet) {
                return;
            }

            switch (currentStep) {
                case step.selectWallet:
                    dispatch({ type: 'next' });
                    break;
                case step.connecting:
                    break;
                case step.connected:
                    dispatch({ type: 'next' });
                    onClose();
                    break;
            }
        },
        [onClose, wallet]
    );

    const handleClose = () => {
        dispatch({ type: 'default' });
        onClose();
    };

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
                    case step.selectWallet:
                        return (
                            <WalletRadioGroup
                                value={wallet}
                                onChange={setWallet}
                            />
                        );
                    case step.connecting:
                        return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={Loader.src}
                                alt='Loader'
                                className='animate-spin'
                            ></img>
                        );
                        break;
                    case step.connected:
                        return <Check className='h-[100px] w-[100px]' />;
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
