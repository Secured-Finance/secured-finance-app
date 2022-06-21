import { useCallback, useReducer, useState } from 'react';
import WalletRadioGroup from 'src/components/molecules/WalletRadioGroup';

import { Dialog } from '../../molecules/Dialog/Dialog';

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
        nextStep: step.selectWallet,
        currentStep: step.connected,
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
    const [wallet, setWallet] = useState<string | undefined>();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);

    const onClick = useCallback(
        (currentStep: step) => {
            if (!wallet) {
                return;
            }

            switch (currentStep) {
                case step.selectWallet:
                    dispatch({ type: 'next' });
                    setTimeout(() => {
                        dispatch({ type: 'next' });
                    }, 2000);
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

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
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
                        return <p>Placeholder...</p>;
                    case step.connected:
                        return <p>Connected</p>;
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
