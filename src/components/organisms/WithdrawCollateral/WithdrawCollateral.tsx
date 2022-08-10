import { BigNumber } from 'ethers';
import { useCallback, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Check from 'src/assets/icons/check-mark.svg';
import Loader from 'src/assets/img/gradient-loader.png';
import { CollateralObject, CollateralSelector } from 'src/components/atoms';
import { Dialog } from 'src/components/molecules';
import { useCheckCollateralBook, useCollateralBook } from 'src/hooks';
import { useWithdrawCollateral } from 'src/hooks/useDepositCollateral';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { updateCollateralAmount } from 'src/store/collateralForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol, getDisplayBalance } from 'src/utils';
import { useWallet } from 'use-wallet';
import { CollateralInput } from '../CollateralInput';
import { CollateralInfo } from '../DepositCollateral';

enum Step {
    withdrawCollateral = 1,
    withdrawing,
    withdrawn,
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
            'You have succesfully withdrawn collateral on Secured Finance.',
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
                ...stateRecord[Step.withdrawCollateral],
            };
    }
};

export const WithdrawCollateral = ({
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
    const colBook = useCollateralBook(account);

    const assetList: Record<string, CollateralInfo> = {
        ETH: {
            id: 1,
            asset: CurrencySymbol.ETH,
            available: parseFloat(getDisplayBalance(colBook.collateral)),
            assetName: 'Ethereum',
        },
    };

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const collateral = useSelector(
        (state: RootState) => state.collateralForm.amount
    );
    const { onWithdrawCollateral } = useWithdrawCollateral(
        currencyShortName as CurrencySymbol,
        BigNumber.from(collateral)
    );

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleWithdrawCollateral = useCallback(async () => {
        try {
            setCollateralTx(true);
            if (status) {
                const txHash = await onWithdrawCollateral();
                if (!txHash) {
                    setCollateralTx(false);
                }
            }
        } catch (e) {
            console.error(e);
            handleClose();
        }
        dispatch({ type: 'next' });
    }, [status, onWithdrawCollateral, handleClose]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            if (!wallet) {
                return;
            }

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
            }
        },
        [wallet, handleWithdrawCollateral, handleClose]
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
                    case Step.withdrawCollateral:
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
                    case Step.withdrawing:
                        return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={Loader.src}
                                alt='Loader'
                                className='animate-spin'
                            ></img>
                        );
                        break;
                    case Step.withdrawn:
                        return <Check className='h-[100px] w-[100px]' />;
                    default:
                        return <p>Unknown</p>;
                }
            })()}
        </Dialog>
    );
};
