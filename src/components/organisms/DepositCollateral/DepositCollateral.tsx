import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import Check from 'src/assets/icons/check-mark.svg';
import Loader from 'src/assets/img/gradient-loader.png';
import { CollateralSelector } from 'src/components/atoms';
import { Dialog } from 'src/components/molecules';
import { useCheckCollateralBook } from 'src/hooks';
import { useDepositCollateral } from 'src/hooks/useDepositCollateral';
import { useRegisterUser } from 'src/hooks/useRegisterUser';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CollateralInfo, CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';
import { CollateralInput } from '../CollateralInput';

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
            'You have succesfully deposited collateral on Secured Finance.',
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
    isOpen: boolean;
    onClose: () => void;
    collateralList: Record<string, CollateralInfo>;
}) => {
    const [asset, setAsset] = useState(CurrencySymbol.ETH);
    const [collateral, setCollateral] = useState('0');
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const { account } = useWallet();
    const status = useCheckCollateralBook(account);

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const { onRegisterUser } = useRegisterUser();
    const { onDepositCollateral } = useDepositCollateral(
        CurrencySymbol.ETH,
        BigNumber.from(collateral)
    );

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleDepositCollateral = useCallback(async () => {
        try {
            if (status) {
                await onDepositCollateral();
            } else {
                await onRegisterUser();
            }
            dispatch({ type: 'next' });
        } catch (e) {
            console.error(e);
            handleClose();
        }
    }, [status, onDepositCollateral, onRegisterUser, handleClose]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.depositCollateral:
                    if (!collateral || collateral === '0') return;
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
                                        setCollateral(v.toString())
                                    }
                                    availableAmount={
                                        collateralList[asset].available
                                    }
                                />
                            </div>
                        );
                    case Step.depositing:
                        return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={Loader.src}
                                alt='Loader'
                                className='animate-spin'
                            ></img>
                        );
                        break;
                    case Step.deposited:
                        return <Check className='h-[100px] w-[100px]' />;
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
