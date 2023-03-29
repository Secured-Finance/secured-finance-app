import { track } from '@amplitude/analytics-browser';
import { Disclosure } from '@headlessui/react';
import { OrderSide } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { useCallback, useReducer } from 'react';
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
    SuccessPanel,
} from 'src/components/molecules';
import { CollateralBook, OrderType } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import { PlaceOrderFunction } from 'src/types';
import {
    CurrencySymbol,
    handleContractTransaction,
    OrderEvents,
    OrderProperties,
    ordinaryFormat,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

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
    collateral,
    loanValue,
    onPlaceOrder,
}: {
    collateral: CollateralBook;
    loanValue?: LoanValue;
    onPlaceOrder: PlaceOrderFunction;
} & DialogState) => {
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const globalDispatch = useDispatch();
    const { currency, maturity, amount, side, orderType } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const orderAmount = new Amount(amount, currency);

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
            unitPrice?: number
        ) => {
            try {
                const tx = await onPlaceOrder(
                    ccy,
                    maturity,
                    side,
                    amount,
                    unitPrice
                );
                const transactionStatus = await handleContractTransaction(tx);
                if (!transactionStatus) {
                    console.error('Some error occurred');
                    handleClose();
                } else {
                    track(OrderEvents.ORDER_PLACED, {
                        [OrderProperties.ORDER_SIDE]:
                            side === OrderSide.BORROW ? 'Borrow' : 'Lend',
                        [OrderProperties.ORDER_TYPE]: orderType,
                        [OrderProperties.ASSET_TYPE]: ccy,
                        [OrderProperties.ORDER_MATURITY]: getUTCMonthYear(
                            maturity.toNumber()
                        ),
                        [OrderProperties.ORDER_AMOUNT]: orderAmount.value,
                        [OrderProperties.ORDER_PRICE]: unitPrice ?? 0,
                    });
                    dispatch({ type: 'next' });
                }
            } catch (e) {
                if (e instanceof Error) {
                    globalDispatch(setLastMessage(e.message));
                }
            }
        },
        [
            onPlaceOrder,
            handleClose,
            orderType,
            orderAmount.value,
            globalDispatch,
        ]
    );

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.orderConfirm:
                    dispatch({ type: 'next' });
                    if (orderType === OrderType.MARKET) {
                        handlePlaceOrder(currency, maturity, side, amount);
                    } else if (orderType === OrderType.LIMIT && loanValue) {
                        handlePlaceOrder(
                            currency,
                            maturity,
                            side,
                            amount,
                            loanValue.price
                        );
                    } else {
                        console.error('Invalid order type');
                    }

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
            loanValue,
            maturity,
            orderType,
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
                                        amount={orderAmount}
                                        price={price}
                                    />
                                </Section>
                                <CollateralSimulationSection
                                    collateral={collateral}
                                    tradeAmount={orderAmount}
                                    tradePosition={side}
                                    assetPrice={price}
                                    tradeValue={loanValue}
                                    type='trade'
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
                                                        [
                                                            'Bond Price',
                                                            loanValue
                                                                ? loanValue.price.toString()
                                                                : 'Market Order',
                                                        ],
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
                            <SuccessPanel
                                itemList={[
                                    ['Status', 'Complete'],
                                    ['Deposit Address', 't1wtz1if6k24XE...'],
                                    [
                                        'Amount',
                                        `${ordinaryFormat(
                                            orderAmount.value
                                        )} ${currency}`,
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
