import { track } from '@amplitude/analytics-browser';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { Spinner } from 'src/components/atoms';
import {
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import { OrderDetails } from 'src/components/organisms';
import {
    CollateralBook,
    useEtherscanUrl,
    useHandleContractTransaction,
} from 'src/hooks';
import { OrderType, PlaceOrderFunction } from 'src/types';
import {
    AddressUtils,
    CurrencySymbol,
    OrderEvents,
    OrderProperties,
    formatAmount,
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
    isCurrencyDelisted,
}: {
    collateral: CollateralBook;
    loanValue: LoanValue;
    onPlaceOrder: PlaceOrderFunction;
    orderAmount: Amount;
    maturity: Maturity;
    side: OrderSide;
    orderType: OrderType;
    assetPrice: number;
    walletSource: WalletSource;
    isCurrencyDelisted: boolean;
} & DialogState) => {
    const etherscanUrl = useEtherscanUrl();
    const handleContractTransaction = useHandleContractTransaction();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [txHash, setTxHash] = useState<string | undefined>();

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
                if (e instanceof Error) {
                    setErrorMessage(e.message);
                }
                dispatch({ type: 'error' });
            }
        },
        [onPlaceOrder, handleContractTransaction, orderType, orderAmount.value]
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
                            <OrderDetails
                                amount={orderAmount}
                                maturity={maturity}
                                side={side}
                                assetPrice={assetPrice}
                                collateral={collateral}
                                loanValue={loanValue}
                                isCurrencyDelisted={isCurrencyDelisted}
                            />
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
                                        `${formatAmount(orderAmount.value)} ${
                                            orderAmount.currency
                                        }`,
                                    ],
                                ]}
                                txHash={txHash}
                                etherscanUrl={etherscanUrl}
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
