import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from 'src/assets/img/gradient-loader.png';
import { CollateralSelector } from 'src/components/atoms';
import { Dialog, DialogState, SuccessPanel } from 'src/components/molecules';
import { CollateralInput } from 'src/components/organisms';
import { useDepositCollateral } from 'src/hooks/useDepositCollateral';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    AddressUtils,
    amountFormatterFromBase,
    CollateralInfo,
    CurrencySymbol,
    handleContractTransaction,
} from 'src/utils';

enum Step {
    depositCollateral = 1,
    depositing,
    deposited,
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
                ...stateRecord[Step.depositCollateral],
            };
    }
};

export const DepositCollateral = ({
    isOpen,
    onClose,
    collateralList,
}: {
    collateralList: Record<string, CollateralInfo>;
} & DialogState) => {
    const [asset, setAsset] = useState(CurrencySymbol.ETH);
    const [collateral, setCollateral] = useState(BigNumber.from(0));
    const [depositAddress, setDepositAddress] = useState('');
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const { onDepositCollateral } = useDepositCollateral(asset, collateral);

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleDepositCollateral = useCallback(async () => {
        try {
            const tx = await onDepositCollateral();
            const transactionStatus = await handleContractTransaction(tx);
            if (!transactionStatus) {
                console.error('Some error occured');
                handleClose();
            } else {
                setDepositAddress(tx?.to ?? '');
                dispatch({ type: 'next' });
            }
        } catch (e) {
            console.error(e);
            handleClose();
        }
    }, [onDepositCollateral, handleClose]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.depositCollateral:
                    if (!collateral || collateral.isZero()) return;
                    dispatch({ type: 'next' });
                    handleDepositCollateral();
                    break;
                case Step.depositing:
                    break;
                case Step.deposited:
                    handleClose();
                    break;
            }
        },
        [collateral, handleClose, handleDepositCollateral]
    );

    const handleChange = (v: CollateralInfo) => {
        setAsset(v.symbol);
    };

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
                    case Step.depositCollateral:
                        return (
                            <div className='flex flex-col gap-6'>
                                <CollateralSelector
                                    headerText='Select Asset'
                                    onChange={v => handleChange(v)}
                                    optionList={Object.values(collateralList)}
                                />
                                <CollateralInput
                                    price={priceList[asset]}
                                    asset={asset}
                                    onAmountChange={(v: BigNumber) =>
                                        setCollateral(v)
                                    }
                                    availableAmount={
                                        collateralList[asset].available
                                    }
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
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
