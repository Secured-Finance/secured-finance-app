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
    useCollateralBook,
    useEtherscanUrl,
    useHandleContractTransaction,
    useMarket,
    useOrders,
} from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import { AddressUtils, CurrencySymbol } from 'src/utils';
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
    const handleContractTransaction = useHandleContractTransaction();
    const { address } = useAccount();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState(
        'Your position could not be unwound.'
    );
    const globalDispatch = useDispatch();

    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);
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
        [unwindPosition, handleContractTransaction, globalDispatch]
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

    const renderSelection = () => {
        switch (state.currentStep) {
            case Step.confirm:
                return (
                    <OrderDetails
                        amount={amount}
                        maturity={maturity}
                        side={side}
                        assetPrice={price}
                        collateral={collateralBook}
                        loanValue={marketValue}
                    />
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
