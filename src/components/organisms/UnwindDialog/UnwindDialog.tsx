import { Disclosure } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { useCallback, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'src/assets/img/gradient-loader.png';
import {
    ExpandIndicator,
    Section,
    SectionWithItems,
} from 'src/components/atoms';
import {
    AmountCard,
    CollateralSimulationSection,
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import { useCollateralBook, useOrders } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import { CurrencySymbol, handleContractTransaction } from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

enum Step {
    confirm = 1,
    processing,
    placed,
    error,
}

type State = {
    currentStep: Step;
    nextStep: Step;
    title: string;
    description: string;
    buttonText: string;
};

const stateRecord: Record<Step, State> = {
    [Step.confirm]: {
        currentStep: Step.confirm,
        nextStep: Step.processing,
        title: 'Unwind Position',
        description: '',
        buttonText: 'Confirm',
    },
    [Step.processing]: {
        currentStep: Step.processing,
        nextStep: Step.placed,
        title: 'Unwinding Position...',
        description: '',
        buttonText: '',
    },
    [Step.placed]: {
        currentStep: Step.placed,
        nextStep: Step.confirm,
        title: 'Success!',
        description: 'Your position was successfully unwound.',
        buttonText: 'OK',
    },
    [Step.error]: {
        currentStep: Step.error,
        nextStep: Step.confirm,
        title: 'Failed!',
        description: '',
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
        case 'error':
            return {
                ...stateRecord[Step.error],
            };
        default:
            return {
                ...stateRecord[Step.confirm],
            };
    }
};
export const UnwindDialog = ({
    isOpen,
    onClose,
    amount,
    maturity,
}: {
    amount: Amount;
    maturity: Maturity;
} & DialogState) => {
    const { account } = useWallet();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [txHash, setTxHash] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState(
        'Your position could not be unwound.'
    );
    const globalDispatch = useDispatch();

    const collateral = useCollateralBook(account);
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[amount.currency];

    const { unwindPosition } = useOrders();

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleunwindPosition = useCallback(
        async (ccy: CurrencySymbol, maturity: Maturity) => {
            try {
                const tx = await unwindPosition(ccy, maturity);
                const transactionStatus = await handleContractTransaction(tx);
                if (!transactionStatus) {
                    dispatch({ type: 'error' });
                } else {
                    setTxHash(tx?.hash);
                    dispatch({ type: 'next' });
                }
            } catch (e) {
                if (e instanceof Error) {
                    setErrorMessage(e.message);
                    globalDispatch(setLastMessage(e.message));
                }
            }
        },
        [unwindPosition, globalDispatch]
    );

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.confirm:
                    dispatch({ type: 'next' });
                    handleunwindPosition(amount.currency, maturity);
                    break;
                case Step.processing:
                    break;
                case Step.placed:
                    handleClose();
                    break;
                case Step.error:
                    handleClose();
                    break;
            }
        },
        [amount.currency, handleClose, handleunwindPosition, maturity]
    );

    const renderSelection = () => {
        switch (state.currentStep) {
            case Step.confirm:
                return (
                    <div className='grid w-full grid-cols-1 justify-items-stretch gap-6 text-white'>
                        <Section>
                            <AmountCard amount={amount} price={price} />
                        </Section>
                        <CollateralSimulationSection
                            collateral={collateral}
                            tradeAmount={amount}
                            tradePosition={OrderSide.BORROW}
                            assetPrice={price}
                            type='unwind'
                        />
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className='flex h-6 flex-row items-center justify-between'>
                                        <h2 className='typography-hairline-2 text-neutral-8'>
                                            Additional Information
                                        </h2>
                                        <ExpandIndicator expanded={open} />
                                    </Disclosure.Button>
                                    <Disclosure.Panel>
                                        <SectionWithItems
                                            itemList={[
                                                [
                                                    'Contract Borrowed Amount',
                                                    '0.1 ETH',
                                                ],
                                                [
                                                    'Collateralization Ratio',
                                                    '150%',
                                                ],
                                                [
                                                    'Liquidation Price',
                                                    '0.1 ETH',
                                                ],
                                            ]}
                                        />
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    </div>
                );
            case Step.processing:
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
            case Step.placed:
                return (
                    <SuccessPanel
                        itemList={[
                            ['Status', 'Complete'],
                            ['Transaction Hash', txHash ?? ''],
                        ]}
                    />
                );
            case Step.error:
                return <FailurePanel errorMessage={errorMessage} />;
        }
    };

    return (
        <Dialog
            title={state.title}
            description={state.description}
            callToAction={state.buttonText}
            onClose={handleClose}
            isOpen={isOpen}
            onClick={() => onClick(state.currentStep)}
        >
            {renderSelection()}
        </Dialog>
    );
};
