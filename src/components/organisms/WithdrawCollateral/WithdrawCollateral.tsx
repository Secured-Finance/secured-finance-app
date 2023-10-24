import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { CollateralSelector, Spinner } from 'src/components/atoms';
import {
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import { CollateralInput } from 'src/components/organisms';
import { useEtherscanUrl, useHandleContractTransaction } from 'src/hooks';
import { useWithdrawCollateral } from 'src/hooks/useDepositCollateral';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    CollateralInfo,
    CurrencySymbol,
    ZERO_BN,
    amountFormatterFromBase,
    amountFormatterToBase,
    formatAmount,
} from 'src/utils';
import { CollateralEvents, trackCollateralEvent } from 'src/utils/events';
import { useAccount } from 'wagmi';

enum Step {
    withdrawCollateral = 1,
    withdrawing,
    withdrawn,
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
    [Step.withdrawCollateral]: {
        currentStep: Step.withdrawCollateral,
        nextStep: Step.withdrawing,
        title: 'Withdraw Collateral',
        description: '',
        buttonText: 'Continue',
    },
    [Step.withdrawing]: {
        currentStep: Step.withdrawing,
        nextStep: Step.withdrawn,
        title: 'Withdrawing...',
        description: '',
        buttonText: '',
    },
    [Step.withdrawn]: {
        currentStep: Step.withdrawn,
        nextStep: Step.withdrawCollateral,
        title: 'Success!',
        description:
            'You have successfully withdrawn collateral on Secured Finance.',
        buttonText: 'OK',
    },
    [Step.error]: {
        currentStep: Step.error,
        nextStep: Step.withdrawCollateral,
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
                ...stateRecord[Step.withdrawCollateral],
            };
    }
};

export const WithdrawCollateral = ({
    isOpen,
    onClose,
    collateralList,
    selected,
    source,
}: {
    collateralList: Record<CurrencySymbol, CollateralInfo>;
    selected?: CurrencySymbol;
} & DialogState) => {
    const etherscanUrl = useEtherscanUrl();
    const handleContractTransaction = useHandleContractTransaction();
    const { address } = useAccount();
    const [asset, setAsset] = useState(CurrencySymbol.ETH);
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [collateral, setCollateral] = useState<BigNumber>();
    const [txHash, setTxHash] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState(
        'Your withdrawal transaction has failed.'
    );

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const { onWithdrawCollateral } = useWithdrawCollateral(
        asset,
        collateral ?? ZERO_BN
    );

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const isDisabled = useCallback(() => {
        return (
            state.currentStep === Step.withdrawCollateral &&
            (!collateral ||
                collateral.isZero() ||
                collateral.gt(
                    amountFormatterToBase[asset](
                        collateralList[asset]?.available ?? 0
                    )
                ))
        );
    }, [collateralList, asset, collateral, state.currentStep]);

    const handleWithdrawCollateral = useCallback(async () => {
        try {
            const tx = await onWithdrawCollateral();
            const transactionStatus = await handleContractTransaction(tx);
            if (!transactionStatus) {
                dispatch({ type: 'error' });
            } else {
                trackCollateralEvent(
                    CollateralEvents.WITHDRAW_COLLATERAL,
                    asset,
                    collateral ?? ZERO_BN,
                    source ?? ''
                );
                setTxHash(tx?.hash);
                dispatch({ type: 'next' });
            }
        } catch (e) {
            if (e instanceof Error) {
                setErrorMessage(e.message);
            }
            dispatch({ type: 'error' });
        }
    }, [
        asset,
        collateral,
        handleContractTransaction,
        onWithdrawCollateral,
        source,
    ]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.withdrawCollateral:
                    dispatch({ type: 'next' });
                    handleWithdrawCollateral();
                    break;
                case Step.withdrawing:
                    break;
                case Step.withdrawn:
                    handleClose();
                    break;
                case Step.error:
                    handleClose();
                    break;
            }
        },
        [handleWithdrawCollateral, handleClose]
    );

    const handleChange = useCallback((v: CollateralInfo) => {
        setAsset(v.symbol);
        setCollateral(undefined);
    }, []);

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={state.title}
            description={state.description}
            callToAction={state.buttonText}
            onClick={() => onClick(state.currentStep)}
            disableActionButton={isDisabled()}
        >
            {(() => {
                switch (state.currentStep) {
                    case Step.withdrawCollateral:
                        return (
                            <div className='flex flex-col gap-6'>
                                <CollateralSelector
                                    headerText='Select Asset'
                                    onChange={handleChange}
                                    optionList={Object.values(collateralList)}
                                    selectedOption={
                                        selected
                                            ? collateralList[selected]
                                            : undefined
                                    }
                                />
                                <CollateralInput
                                    price={priceList[asset]}
                                    asset={asset}
                                    onAmountChange={(
                                        v: BigNumber | undefined
                                    ) => setCollateral(v)}
                                    availableAmount={
                                        collateralList[asset]?.available
                                    }
                                    amount={
                                        collateral
                                            ? amountFormatterFromBase[asset](
                                                  collateral
                                              )
                                            : undefined
                                    }
                                />
                                <div className='typography-caption-2 h-fit rounded-xl border border-red px-3 py-2 text-slateGray'>
                                    Please note that withdrawal will impact the
                                    LTV ratio and liquidation threshold
                                    collateral requirement for active contracts
                                    on Secured Finance.
                                </div>
                            </div>
                        );
                    case Step.withdrawing:
                        return (
                            <div className='flex h-full w-full items-center justify-center py-9'>
                                <Spinner />
                            </div>
                        );
                        break;
                    case Step.withdrawn:
                        return (
                            <SuccessPanel
                                itemList={[
                                    ['Status', 'Complete'],
                                    [
                                        'Ethereum Address',
                                        AddressUtils.format(address ?? '', 8),
                                    ],
                                    [
                                        'Amount',
                                        `${formatAmount(
                                            amountFormatterFromBase[asset](
                                                collateral ?? ZERO_BN
                                            )
                                        )} ${asset}`,
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
