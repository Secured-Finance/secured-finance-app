import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from 'src/assets/img/gradient-loader.png';
import { CollateralSelector } from 'src/components/atoms';
import {
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import { CollateralInput } from 'src/components/organisms';
import { useDepositCollateral } from 'src/hooks/useDepositCollateral';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    amountFormatterFromBase,
    amountFormatterToBase,
    CollateralEvents,
    CollateralInfo,
    CurrencySymbol,
    handleContractTransaction,
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
    const [asset, setAsset] = useState(CurrencySymbol.USDC);
    const [collateral, setCollateral] = useState(BigNumber.from(0));
    const [depositAddress, setDepositAddress] = useState('');
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [errorMessage, setErrorMessage] = useState(
        'Your deposit transaction has failed.'
    );
    const [collateralAmount, setCollateralAmount] = useState<
        number | undefined
    >();

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const { onDepositCollateral } = useDepositCollateral(asset, collateral);

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
        const availableAmount = collateralList[asset]?.available;
        return (
            !collateral ||
            collateral.isZero() ||
            collateral.gt(amountFormatterToBase[asset](availableAmount ?? 0))
        );
    }, [asset, collateral, collateralList]);

    const handleDepositCollateral = useCallback(async () => {
        try {
            const tx = await onDepositCollateral();
            const transactionStatus = await handleContractTransaction(tx);
            if (!transactionStatus) {
                dispatch({ type: 'error' });
            } else {
                setDepositAddress(tx?.to ?? '');
                trackCollateralEvent(
                    CollateralEvents.DEPOSIT_COLLATERAL,
                    asset,
                    collateral,
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
    }, [asset, collateral, onDepositCollateral, source]);

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
        setCollateral(BigNumber.from(0));
        setAsset(v.symbol);
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
                                    onAmountChange={(v: BigNumber) =>
                                        setCollateral(v)
                                    }
                                    availableAmount={
                                        collateralList[asset]?.available ?? 0
                                    }
                                    amount={collateralAmount}
                                    setAmount={setCollateralAmount}
                                />
                            </div>
                        );
                    case Step.depositing:
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
                    case Step.deposited:
                        return (
                            <SuccessPanel
                                itemList={[
                                    ['Status', 'Complete'],
                                    [
                                        'Deposit Address',
                                        AddressUtils.format(
                                            depositAddress ?? '',
                                            6
                                        ),
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
