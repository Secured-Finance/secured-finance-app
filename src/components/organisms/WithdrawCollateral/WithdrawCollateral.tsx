import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from 'src/assets/img/gradient-loader.png';
import { CollateralSelector } from 'src/components/atoms';
import { Dialog, DialogState, SuccessPanel } from 'src/components/molecules';
import { FailurePanel } from 'src/components/molecules/FailurePanel';
import { CollateralInput } from 'src/components/organisms';
import { useWithdrawCollateral } from 'src/hooks/useDepositCollateral';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    amountFormatterFromBase,
    amountFormatterToBase,
    CollateralInfo,
    CurrencySymbol,
    handleContractTransaction,
} from 'src/utils';
import { useWallet } from 'use-wallet';

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
}: {
    collateralList: Record<CurrencySymbol, CollateralInfo>;
} & DialogState) => {
    const { account } = useWallet();
    const [asset, setAsset] = useState(CurrencySymbol.ETH);
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [collateral, setCollateral] = useState(BigNumber.from(0));
    const [errorMessage, setErrorMessage] = useState(
        'Your withdrawal transaction has failed.'
    );
    const [collateralAmount, setCollateralAmount] = useState<
        number | undefined
    >(0);

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const { onWithdrawCollateral } = useWithdrawCollateral(asset, collateral);

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const isDisabled = useCallback(() => {
        return (
            !collateral ||
            collateral.isZero() ||
            collateral.gt(
                amountFormatterToBase[asset](
                    collateralList[asset]?.available ?? 0
                )
            )
        );
    }, [collateralList, asset, collateral]);

    const handleWithdrawCollateral = useCallback(async () => {
        try {
            const tx = await onWithdrawCollateral();
            const transactionStatus = await handleContractTransaction(tx);
            if (!transactionStatus) {
                dispatch({ type: 'error' });
            } else {
                dispatch({ type: 'next' });
            }
        } catch (e) {
            if (e instanceof Error) {
                setErrorMessage(e.message);
            }
            dispatch({ type: 'error' });
        }
    }, [onWithdrawCollateral]);

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
        setCollateral(BigNumber.from(0));
        setCollateralAmount(0);
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
                                />
                                <CollateralInput
                                    price={priceList[asset]}
                                    asset={asset}
                                    onAmountChange={(v: BigNumber) =>
                                        setCollateral(v)
                                    }
                                    availableAmount={
                                        collateralList[asset]?.available ?? 0
                                    }
                                    amount={collateralAmount}
                                    setAmount={setCollateralAmount}
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
                            <div className='py-9'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={Loader.src}
                                    alt='Loader'
                                    className='animate-spin'
                                ></img>
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
                                        AddressUtils.format(account ?? '', 6),
                                    ],
                                    [
                                        'Amount',
                                        amountFormatterFromBase[asset](
                                            collateral
                                        ).toString(),
                                    ],
                                ]}
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
