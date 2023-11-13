import { OrderSide } from '@secured-finance/sf-client';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'src/components/atoms';
import {
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import { OrderDetails } from 'src/components/organisms';
import {
    emptyCollateralBook,
    useEtherscanUrl,
    useHandleContractTransaction,
    useMarket,
    useOrders,
} from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import { AddressUtils } from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

enum Step {
    confirm = 1,
    processing,
    cancelled,
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
        title: 'Cancel Order',
        description: '',
        buttonText: 'Confirm',
    },
    [Step.processing]: {
        currentStep: Step.processing,
        nextStep: Step.cancelled,
        title: 'Cancelling Order...',
        description: '',
        buttonText: '',
    },
    [Step.cancelled]: {
        currentStep: Step.cancelled,
        nextStep: Step.confirm,
        title: 'Cancelled!',
        description: 'Your order was successfully cancelled.',
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

export const CancelOrderDialog = ({
    isOpen,
    onClose,
    amount,
    orderId,
    maturity,
    side,
}: {
    amount: Amount;
    maturity: Maturity;
    orderId: bigint;
    side: OrderSide;
} & DialogState) => {
    const etherscanUrl = useEtherscanUrl();
    const handleContractTransaction = useHandleContractTransaction();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState(
        'Your position could not be cancelled.'
    );
    const globalDispatch = useDispatch();

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[amount.currency];

    const market = useMarket(amount.currency, maturity.toNumber());

    const marketValue = useMemo(() => {
        if (!market) {
            return LoanValue.ZERO;
        }

        const unitPrice =
            side === OrderSide.BORROW
                ? market.bestBorrowUnitPrice
                : market.bestLendUnitPrice;

        return LoanValue.fromPrice(unitPrice, maturity.toNumber());
    }, [market, maturity, side]);

    const { cancelOrder } = useOrders();

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleCancelOrder = useCallback(async () => {
        try {
            const tx = await cancelOrder(orderId, amount.currency, maturity);
            const transactionStatus = await handleContractTransaction(tx);
            if (!transactionStatus) {
                dispatch({ type: 'error' });
            } else {
                setTxHash(tx);
                dispatch({ type: 'next' });
            }
        } catch (e) {
            console.error(e);
            dispatch({ type: 'error' });
            if (e instanceof Error) {
                setErrorMessage(e.message);
                globalDispatch(setLastMessage(e.message));
            }
        }
    }, [
        cancelOrder,
        orderId,
        amount.currency,
        maturity,
        handleContractTransaction,
        globalDispatch,
    ]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.confirm:
                    dispatch({ type: 'next' });
                    handleCancelOrder();
                    break;
                case Step.processing:
                    break;
                case Step.cancelled:
                    handleClose();
                    break;
                case Step.error:
                    handleClose();
                    break;
            }
        },
        [handleCancelOrder, handleClose]
    );

    const renderSelection = () => {
        switch (state.currentStep) {
            case Step.confirm:
                return (
                    <OrderDetails
                        amount={amount}
                        maturity={maturity}
                        side={side}
                        assetPrice={price}
                        collateral={emptyCollateralBook}
                        loanValue={marketValue}
                        isCancelOrder={true}
                    />
                );
            case Step.processing:
                return (
                    <div className='flex h-full w-full items-center justify-center py-9'>
                        <Spinner />
                    </div>
                );
            case Step.cancelled:
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
            showCancelButton={state.currentStep === Step.confirm}
        >
            {renderSelection()}
        </Dialog>
    );
};
