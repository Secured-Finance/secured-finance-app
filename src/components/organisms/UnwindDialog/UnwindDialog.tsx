import { Disclosure, Transition } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { formatDate } from '@secured-finance/sf-core';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ExpandIndicator,
    InformationPopover,
    Section,
    SectionWithItems,
    Spinner,
} from 'src/components/atoms';
import {
    AmountCard,
    CollateralSimulationSection,
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import {
    useCollateralBook,
    useEtherscanUrl,
    useOrderFee,
    useOrders,
} from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { selectMarket } from 'src/store/availableContracts';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    CurrencySymbol,
    calculateFee,
    handleContractTransaction,
    prefixTilde,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

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
    side,
}: {
    amount: Amount;
    maturity: Maturity;
    side: OrderSide;
} & DialogState) => {
    const etherscanUrl = useEtherscanUrl();
    const { address: account } = useAccount();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState(
        'Your position could not be unwound.'
    );
    const globalDispatch = useDispatch();

    const collateral = useCollateralBook(account);
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[amount.currency];

    const market = useSelector((state: RootState) =>
        selectMarket(amount.currency, maturity.toNumber())(state)
    );

    const marketValue = useMemo(() => {
        if (!market) {
            return LoanValue.ZERO;
        }

        const unitPrice =
            side === OrderSide.BORROW
                ? market.borrowUnitPrice
                : market.lendUnitPrice;

        return LoanValue.fromPrice(unitPrice, maturity.toNumber());
    }, [market, maturity, side]);

    const { unwindPosition } = useOrders();

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleUnwindPosition = useCallback(
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
                    handleUnwindPosition(amount.currency, maturity);
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
        [amount.currency, handleClose, handleUnwindPosition, maturity]
    );

    const orderFee = useOrderFee(amount.currency);

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
                            side={side}
                            assetPrice={price}
                            tradeValue={marketValue}
                        />
                        <SectionWithItems
                            itemList={[
                                [
                                    'Maturity Date',
                                    formatDate(maturity.toNumber()),
                                ],
                                [
                                    feeItem(),
                                    prefixTilde(
                                        calculateFee(
                                            maturity.toNumber(),
                                            orderFee
                                        )
                                    ),
                                ],
                            ]}
                        />
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <div className='relative'>
                                        <Disclosure.Button
                                            className='flex h-6 w-full flex-row items-center justify-between'
                                            data-testid='disclaimer-button'
                                        >
                                            <h2 className='typography-hairline-2 text-neutral-8'>
                                                Circuit Breaker Disclaimer
                                            </h2>
                                            <ExpandIndicator expanded={open} />
                                        </Disclosure.Button>
                                        <Transition
                                            show={open}
                                            enter='transition duration-100 ease-out'
                                            enterFrom='transform scale-95 opacity-0'
                                            enterTo='transform scale-100 opacity-100'
                                        >
                                            <Disclosure.Panel>
                                                <div className='typography-caption pt-3 text-secondary7'>
                                                    Circuit breaker will be
                                                    triggered if the order is
                                                    filled at over the max
                                                    slippage level at 1 block.
                                                </div>
                                            </Disclosure.Panel>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Disclosure>
                    </div>
                );
            case Step.processing:
                return (
                    <div className='flex h-full w-full items-center justify-center py-9'>
                        <Spinner />
                    </div>
                );
            case Step.placed:
                return (
                    <SuccessPanel
                        itemList={[
                            ['Status', 'Complete'],
                            [
                                'Transaction Hash',
                                AddressUtils.format(txHash ?? '', 8),
                            ],
                        ]}
                        txHash={txHash}
                        etherscanUrl={etherscanUrl}
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

const feeItem = () => {
    return (
        <div className='flex flex-row items-center gap-1'>
            <div className='text-planetaryPurple'>Transaction Fee %</div>
            <InformationPopover>
                A duration-based transaction fee only for market takers,
                factored into the bond price, and deducted from its future value
            </InformationPopover>
        </div>
    );
};
