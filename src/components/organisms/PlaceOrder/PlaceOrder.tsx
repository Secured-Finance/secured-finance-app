import { Disclosure } from '@headlessui/react';
import { BigNumber, ContractTransaction } from 'ethers';
import { useCallback, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Check from 'src/assets/icons/check-mark.svg';
import Loader from 'src/assets/img/gradient-loader.png';
import {
    ExpandIndicator,
    Section,
    SectionWithItems,
} from 'src/components/atoms';
import { AmountCard, Dialog } from 'src/components/molecules';
import { OrderSide } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import {
    amountFormatterFromBase,
    CurrencySymbol,
    handleContractTransaction,
    ordinaryFormat,
    Rate,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';

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
        title: 'Confirm Order',
        description: '',
        buttonText: 'OK',
    },
    [Step.orderProcessing]: {
        currentStep: Step.orderProcessing,
        nextStep: Step.orderPlaced,
        title: 'Placing Order...',
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
    marketRate,
    onPlaceOrder,
}: {
    isOpen: boolean;
    onClose: () => void;
    marketRate: Rate;
    onPlaceOrder: (
        ccy: CurrencySymbol,
        maturity: number | BigNumber,
        side: OrderSide,
        amount: BigNumber,
        rate: number
    ) => Promise<ContractTransaction | undefined>;
}) => {
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const globalDispatch = useDispatch();
    const { currency, maturity, amount, side } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const getAmount = () => {
        let format = (x: BigNumber) => x.toNumber();
        if (
            currency &&
            amountFormatterFromBase &&
            amountFormatterFromBase[currency]
        ) {
            format = amountFormatterFromBase[currency];
        }
        return format(amount);
    };

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[currency];

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handlePlaceOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            maturity: Maturity,
            side: OrderSide,
            amount: BigNumber,
            rate: number
        ) => {
            try {
                const tx = await onPlaceOrder(
                    ccy,
                    maturity.getMaturity(),
                    side,
                    amount,
                    rate
                );
                const transactionStatus = await handleContractTransaction(tx);
                if (!transactionStatus) {
                    console.error('Some error occured');
                    handleClose();
                } else {
                    dispatch({ type: 'next' });
                }
            } catch (e) {
                if (e instanceof Error) {
                    globalDispatch(setLastMessage(e.message));
                }
            }
        },
        [onPlaceOrder, dispatch, handleClose, globalDispatch]
    );

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.orderConfirm:
                    dispatch({ type: 'next' });
                    handlePlaceOrder(
                        currency,
                        maturity,
                        side,
                        amount,
                        marketRate.toNumber()
                    );
                    break;
                case Step.orderProcessing:
                    break;
                case Step.orderPlaced:
                    handleClose();
                    break;
            }
        },
        [
            amount,
            currency,
            handleClose,
            handlePlaceOrder,
            marketRate,
            maturity,
            side,
        ]
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
                        return (
                            <div className='grid w-full grid-cols-1 justify-items-stretch gap-6 text-white'>
                                <Section>
                                    <AmountCard
                                        ccy={currency}
                                        amount={getAmount()}
                                        price={price}
                                    />
                                </Section>
                                <SectionWithItems
                                    itemList={[
                                        [
                                            'Borrow Limit Remaining',
                                            '$3,840 / $8,880',
                                        ],
                                        ['Collateral Usage', '50% → 57%'],
                                        ['Borrow APR', marketRate.toPercent()],
                                    ]}
                                />
                                <SectionWithItems
                                    itemList={[
                                        ['Borrow Fee %', '0.25 %'],
                                        ['Total', '$601.25'],
                                    ]}
                                />
                                <Disclosure>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className='flex h-6 flex-row items-center justify-between'>
                                                <h2 className='typography-hairline-2 text-neutral-8'>
                                                    Additional Information
                                                </h2>
                                                <ExpandIndicator
                                                    expanded={open}
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel>
                                                <SectionWithItems
                                                    itemList={[
                                                        ['Bond Price', '79.77'],
                                                        [
                                                            'Loan Start Date',
                                                            'June 21, 2022',
                                                        ],
                                                        [
                                                            'Loan Maturity Date',
                                                            'Dec 22, 2022',
                                                        ],
                                                        [
                                                            'Total Interest (USD)',
                                                            '$120.00',
                                                        ],
                                                        [
                                                            'Est. Total Debt (USD)',
                                                            '$720.00',
                                                        ],
                                                    ]}
                                                />
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            </div>
                        );
                    case Step.orderProcessing:
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
                                            {ordinaryFormat(getAmount()) +
                                                ' ' +
                                                currency}
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
