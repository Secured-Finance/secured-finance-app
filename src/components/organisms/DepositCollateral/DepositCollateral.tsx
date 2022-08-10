import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Check from 'src/assets/icons/check-mark.svg';
import Loader from 'src/assets/img/gradient-loader.png';
import { CollateralObject, CollateralSelector } from 'src/components/atoms';
import { Dialog } from 'src/components/molecules';
import { useCheckCollateralBook } from 'src/hooks';
import { useDepositCollateral } from 'src/hooks/useDepositCollateral';
import { useRegisterUser } from 'src/hooks/useRegisterUser';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { updateCollateralAmount } from 'src/store/collateralForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';
import { CollateralInput } from '../CollateralInput';

enum Step {
    depositCollateral = 1,
    depositing,
    deposited,
}

export type CollateralInfo = {
    id: number;
    asset: CurrencySymbol;
    available: number;
    assetName: string;
};

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
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [asset, setAsset] = useState(CurrencySymbol.ETH);
    const [wallet, setWallet] = useState<string>('Metamask');
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const currencyShortName = 'ETH';
    const dispatch1 = useDispatch();
    const [, setCollateralTx] = useState(false);
    const { account } = useWallet();
    const status = useCheckCollateralBook(account);
    const {
        ethereum: { balance: ethereumBalance },
    } = useSelector((state: RootState) => state.wallets);

    const assetList: Record<string, CollateralInfo> = {
        ETH: {
            id: 1,
            asset: CurrencySymbol.ETH,
            available: ethereumBalance,
            assetName: 'Ethereum',
        },
        USDC: {
            id: 2,
            asset: CurrencySymbol.USDC,
            available: 1000,
            assetName: 'USDC',
        },
    };

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const collateral = useSelector(
        (state: RootState) => state.collateralForm.amount
    );
    const { onRegisterUser } = useRegisterUser();
    const { onDepositCollateral } = useDepositCollateral(
        currencyShortName as CurrencySymbol,
        BigNumber.from(collateral)
    );

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleDepositCollateral = useCallback(async () => {
        try {
            setCollateralTx(true);
            if (status) {
                const txHash = await onDepositCollateral();
                if (!txHash) {
                    setCollateralTx(false);
                }
            } else {
                const txHash = await onRegisterUser();
                if (!txHash) {
                    setCollateralTx(false);
                }
            }
        } catch (e) {
            console.error(e);
            handleClose();
        }
        dispatch({ type: 'next' });
    }, [status, onDepositCollateral, onRegisterUser, handleClose]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            if (!wallet) {
                return;
            }

            switch (currentStep) {
                case Step.depositCollateral:
                    dispatch({ type: 'next' });
                    handleDepositCollateral();
                    break;
                case Step.depositing:
                    break;
                case Step.deposited:
                    dispatch({ type: 'next' });
                    onClose();
                    break;
            }
        },
        [onClose, wallet, handleDepositCollateral]
    );

    const handleChange = (v: CollateralObject) => {
        setAsset(v.asset);
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
                                    optionList={Object.values(assetList)}
                                />
                                <CollateralInput
                                    price={priceList[asset]}
                                    asset={asset}
                                    onAmountChange={(v: BigNumber) =>
                                        dispatch1(updateCollateralAmount(v))
                                    }
                                    availableAmount={assetList[asset].available}
                                />
                                <div className='typography-caption-2 h-fit rounded-xl border border-red px-3 py-2 text-slateGray'>
                                    Please note that withdrawal will impact the
                                    LTV ratio and liquidation threshold
                                    collateral requirement for active contracts
                                    on Secured Finance.
                                </div>
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
