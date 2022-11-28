import { useCallback, useReducer } from 'react';
import Check from 'src/assets/icons/check-mark.svg';
import Loader from 'src/assets/img/gradient-loader.png';
import { Dialog } from 'src/components/molecules';

enum Step {
    orderConfirm = 1,
    orderProcessing,
    orderPlaced,
}

type State = {
    currentStep: Step;
    nextStep: Step;
    title: string;
    description: string;
    buttonText: string;
};

const stateRecord: Record<Step, State> = {
    [Step.orderConfirm]: {
        currentStep: Step.orderConfirm,
        nextStep: Step.orderProcessing,
        title: 'Confirm Borrow',
        description: '',
        buttonText: 'OK',
    },
    [Step.orderProcessing]: {
        currentStep: Step.orderProcessing,
        nextStep: Step.orderPlaced,
        title: 'Borrowing...',
        description: '',
        buttonText: '',
    },
    [Step.orderPlaced]: {
        currentStep: Step.orderPlaced,
        nextStep: Step.orderConfirm,
        title: 'Success!',
        description: 'Your transaction request was successful.',
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
                ...stateRecord[Step.orderConfirm],
            };
    }
};

export const PlaceOrder = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.orderConfirm:
                    dispatch({ type: 'next' });
                    dispatch({ type: 'next' });
                    break;
                case Step.orderProcessing:
                    break;
                case Step.orderPlaced:
                    handleClose();
                    break;
            }
        },
        [handleClose]
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
                    case Step.orderConfirm:
                        return <div></div>;
                    case Step.orderProcessing:
                        return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={Loader.src}
                                alt='Loader'
                                className='animate-spin'
                            ></img>
                        );
                    case Step.orderPlaced:
                        return (
                            <div className='flex w-full flex-col items-center gap-6'>
                                <Check className='h-[100px] w-[100px]' />
                                <div className='flex h-28 w-full flex-row gap-6 rounded-xl border border-neutral-3 p-6'>
                                    <div className='typography-caption flex flex-col gap-10px'>
                                        <span className='text-neutral-4'>
                                            Status
                                        </span>
                                        <span className='leading-6 text-[#58BD7D]'>
                                            Complete
                                        </span>
                                    </div>
                                    <div className='typography-caption flex flex-col gap-10px'>
                                        <span className='text-neutral-4'>
                                            Deposit Address
                                        </span>
                                        <span className='text-neutral-8'>
                                            t1wtz1if6k24XE...
                                        </span>
                                    </div>
                                    <div className='typography-caption flex flex-col gap-10px'>
                                        <span className='text-neutral-4'>
                                            Amount
                                        </span>
                                        <span className='leading-6 text-neutral-8'>
                                            740 FIL
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
