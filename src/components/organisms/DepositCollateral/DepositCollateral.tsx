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
import { useDepositCollateral } from 'src/hooks/useDepositCollateral';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    CollateralEvents,
    CollateralInfo,
    CurrencySymbol,
    ZERO_BN,
    amountFormatterFromBase,
    amountFormatterToBase,
    formatAmount,
} from 'src/utils';
import { trackCollateralEvent } from 'src/utils/events';

enum Step {
    depositCollateral = 1,
    depositing,
    deposited,
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
    [Step.depositCollateral]: {
        currentStep: Step.depositCollateral,
        nextStep: Step.depositing,
        title: 'Deposit Collateral',
        description: '',
        buttonText: 'Continue',
    },
    [Step.depositing]: {
        currentStep: Step.depositing,
        nextStep: Step.deposited,
        title: 'Depositing...',
        description: '',
        buttonText: '',
    },
    [Step.deposited]: {
        currentStep: Step.deposited,
        nextStep: Step.depositCollateral,
        title: 'Success!',
        description:
            'You have successfully deposited collateral on Secured Finance.',
        buttonText: 'OK',
    },
    [Step.error]: {
        currentStep: Step.error,
        nextStep: Step.depositCollateral,
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
                ...stateRecord[Step.depositCollateral],
            };
    }
};

export const DepositCollateral = ({
    isOpen,
    onClose,
    collateralList,
    source,
}: {
    collateralList: Partial<Record<CurrencySymbol, CollateralInfo>>;
} & DialogState) => {
    const etherscanUrl = useEtherscanUrl();
    const [asset, setAsset] = useState(CurrencySymbol.USDC);
    const [collateral, setCollateral] = useState<BigNumber>();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [errorMessage, setErrorMessage] = useState(
        'Your deposit transaction has failed.'
    );
    const [txHash, setTxHash] = useState<string | undefined>();

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const { onDepositCollateral } = useDepositCollateral(
        asset,
        collateral ?? ZERO_BN
    );
    const handleContractTransaction = useHandleContractTransaction();

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const optionList = Object.values(collateralList);
    const defaultCcyIndex = optionList.findIndex(
        col => col.symbol === CurrencySymbol.USDC
    );
    [optionList[0], optionList[defaultCcyIndex]] = [
        optionList[defaultCcyIndex],
        optionList[0],
    ];

    const isDisabled = useCallback(() => {
        return (
            state.currentStep === Step.depositCollateral &&
            (!collateral ||
                collateral.isZero() ||
                collateral.gt(
                    amountFormatterToBase[asset](
                        collateralList[asset]?.available ?? 0
                    )
                ))
        );
    }, [asset, collateral, collateralList, state.currentStep]);

    const handleDepositCollateral = useCallback(async () => {
        try {
            const tx = await onDepositCollateral();
            const transactionStatus = await handleContractTransaction(tx);
            if (!transactionStatus) {
                dispatch({ type: 'error' });
            } else {
                setTxHash(tx?.hash);
                trackCollateralEvent(
                    CollateralEvents.DEPOSIT_COLLATERAL,
                    asset,
                    collateral ?? ZERO_BN,
                    source ?? ''
                );
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
        onDepositCollateral,
        source,
    ]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.depositCollateral:
                    dispatch({ type: 'next' });
                    handleDepositCollateral();
                    break;
                case Step.depositing:
                    break;
                case Step.deposited:
                    handleClose();
                    break;
                case Step.error:
                    handleClose();
                    break;
            }
        },
        [handleClose, handleDepositCollateral]
    );

    const handleChange = useCallback((v: CollateralInfo) => {
        setCollateral(undefined);
        setAsset(v.symbol);
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
                    case Step.depositCollateral:
                        return (
                            <div className='flex w-full flex-col gap-6'>
                                <CollateralSelector
                                    headerText='Select Asset'
                                    onChange={handleChange}
                                    optionList={optionList}
                                />
                                <CollateralInput
                                    price={priceList[asset]}
                                    asset={asset}
                                    onAmountChange={(
                                        v: BigNumber | undefined
                                    ) => setCollateral(v)}
                                    availableAmount={
                                        collateralList[asset]?.available ?? 0
                                    }
                                    amount={
                                        collateral
                                            ? amountFormatterFromBase[asset](
                                                  collateral
                                              )
                                            : undefined
                                    }
                                />
                            </div>
                        );
                    case Step.depositing:
                        return (
                            <div className='flex h-full w-full items-center justify-center py-9'>
                                <Spinner />
                            </div>
                        );
                        break;
                    case Step.deposited:
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
