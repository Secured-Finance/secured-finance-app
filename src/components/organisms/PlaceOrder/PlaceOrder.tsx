import { track } from '@amplitude/analytics-browser';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { formatDate, getUTCMonthYear } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Section, SectionWithItems, Spinner } from 'src/components/atoms';
import {
    AmountCard,
    CollateralSimulationSection,
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import { CollateralBook } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { setLastMessage } from 'src/store/lastError';
import { OrderType, PlaceOrderFunction } from 'src/types';
import {
    CurrencySymbol,
    OrderEvents,
    OrderProperties,
    handleContractTransaction,
    ordinaryFormat,
    AddressUtils,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

enum Step {
    orderConfirm = 1,
    orderProcessing,
    orderPlaced,
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
    [Step.error]: {
        currentStep: Step.error,
        nextStep: Step.orderConfirm,
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
            return { ...stateRecord[Step.error] };
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
    orderAmount,
    side,
    maturity,
    orderType,
    assetPrice,
    walletSource,
}: {
    collateral: CollateralBook;
    loanValue?: LoanValue;
    onPlaceOrder: PlaceOrderFunction;
    orderAmount: Amount;
    maturity: Maturity;
    side: OrderSide;
    orderType: OrderType;
    assetPrice: number;
    walletSource: WalletSource;
} & DialogState) => {
    const securedFinance = useSF();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [txHash, setTxHash] = useState<string | undefined>();
    const globalDispatch = useDispatch();

    const [errorMessage, setErrorMessage] = useState(
        'Your order could not be placed'
    );

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
            unitPrice: number,
            walletSource: WalletSource
        ) => {
            try {
                const tx = await onPlaceOrder(
                    ccy,
                    maturity,
                    side,
                    amount,
                    unitPrice,
                    walletSource
                );
                const transactionStatus = await handleContractTransaction(tx);
                if (!transactionStatus) {
                    dispatch({ type: 'error' });
                } else {
                    setTxHash(tx?.hash);
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
                dispatch({ type: 'error' });
                if (e instanceof Error) {
                    setErrorMessage(e.message);
                    globalDispatch(setLastMessage(e.message));
                }
            }
        },
        [onPlaceOrder, orderType, orderAmount.value, globalDispatch]
    );

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.orderConfirm:
                    dispatch({ type: 'next' });
                    if (orderType === OrderType.MARKET) {
                        handlePlaceOrder(
                            orderAmount.currency,
                            maturity,
                            side,
                            orderAmount.toBigNumber(),
                            0,
                            walletSource
                        );
                    } else if (orderType === OrderType.LIMIT && loanValue) {
                        handlePlaceOrder(
                            orderAmount.currency,
                            maturity,
                            side,
                            orderAmount.toBigNumber(),
                            loanValue.price,
                            walletSource
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
                case Step.error:
                    handleClose();
                    break;
            }
        },
        [
            handleClose,
            handlePlaceOrder,
            loanValue,
            maturity,
            orderAmount,
            orderType,
            side,
            walletSource,
        ]
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemList: [string, string][] = loanValue
        ? [
              [
                  'Bond Price',
                  loanValue
                      ? (loanValue.price / 100).toString()
                      : 'Market Order',
              ],
              ['Loan Start Date', formatDate(Date.now() / 1000)],
              ['Loan Maturity Date', formatDate(maturity.toNumber())],
              [
                  'Total Interest (USD)',
                  ordinaryFormat(
                      orderAmount.value * loanValue?.apr.toNormalizedNumber()
                  ).toString(),
              ],
              [
                  side === OrderSide.BORROW
                      ? 'Est. Total Debt (USD)'
                      : 'Est. Total Loan value (USD)',
                  ordinaryFormat(
                      orderAmount.value +
                          orderAmount.value *
                              loanValue?.apr.toNormalizedNumber()
                  ).toString(),
              ],
          ]
        : [['Loan Maturity Date', formatDate(maturity.toNumber())]];

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
                                        price={assetPrice}
                                    />
                                </Section>
                                <CollateralSimulationSection
                                    collateral={collateral}
                                    tradeAmount={orderAmount}
                                    tradePosition={side}
                                    assetPrice={assetPrice}
                                    tradeValue={loanValue}
                                    type='trade'
                                    side={side}
                                />
                                <SectionWithItems
                                    itemList={[['Borrow Fee %', '0.25 %']]}
                                />
                                {/* <Disclosure>
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
                                                    itemList={itemList}
                                                />
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure> */}
                            </div>
                        );
                    case Step.orderProcessing:
                        return (
                            <div className='flex h-full w-full items-center justify-center py-9'>
                                <Spinner />
                            </div>
                        );
                    case Step.orderPlaced:
                        return (
                            <SuccessPanel
                                itemList={[
                                    ['Status', 'Complete'],
                                    [
                                        'Transaction hash',
                                        AddressUtils.format(txHash ?? '', 8),
                                    ],
                                    [
                                        'Amount',
                                        `${ordinaryFormat(orderAmount.value)} ${
                                            orderAmount.currency
                                        }`,
                                    ],
                                ]}
                                txHash={txHash}
                                network={
                                    securedFinance?.config?.network ?? 'unknown'
                                }
                            />
                        );
                    case Step.error:
                        return <FailurePanel errorMessage={errorMessage} />;
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
