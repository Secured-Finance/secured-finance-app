import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { Selector, Spinner } from 'src/components/atoms';
import {
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
    Tooltip,
} from 'src/components/molecules';
import { ZCTokenInput } from 'src/components/organisms';
import {
    useBlockExplorerUrl,
    useHandleContractTransaction,
    useLastPrices,
    useWithdrawZCToken,
    useZCToken,
} from 'src/hooks';
import {
    AddressUtils,
    CurrencySymbol,
    convertToZcTokenName,
    convertZCTokenFromBaseAmount,
    formatAmount,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';
import {
    ButtonEvents,
    ButtonProperties,
    CollateralEvents,
    trackButtonEvent,
    trackCollateralEvent,
} from 'src/utils/events';
import { useAccount } from 'wagmi';

enum Step {
    withdrawZCBonds = 1,
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
    [Step.withdrawZCBonds]: {
        currentStep: Step.withdrawZCBonds,
        nextStep: Step.withdrawing,
        title: 'Withdraw ZC Bonds',
        description: '',
        buttonText: 'OK',
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
        nextStep: Step.withdrawZCBonds,
        title: 'Success!',
        description:
            'You have successfully withdrawn ZC Bonds on Secured Finance.',
        buttonText: 'OK',
    },
    [Step.error]: {
        currentStep: Step.error,
        nextStep: Step.withdrawZCBonds,
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
                ...stateRecord[Step.withdrawZCBonds],
            };
    }
};

const CopyTokenAddressButton = ({
    symbol,
    maturity,
}: {
    symbol: CurrencySymbol;
    maturity?: Maturity;
}) => {
    const { data: address } = useZCToken(symbol, maturity || new Maturity(0));

    return (
        <Tooltip
            placement='bottom'
            iconElement={
                <div
                    role='button'
                    className='flex h-7 w-7 items-center justify-center rounded-2xl bg-gunMetal'
                    tabIndex={0}
                    onClick={e => {
                        address && navigator.clipboard.writeText(address);
                        e.stopPropagation();
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            address && navigator.clipboard.writeText(address);
                            e.stopPropagation();
                        }
                    }}
                >
                    <ClipboardDocumentIcon className='h-4 w-4 text-slateGray hover:text-planetaryPurple' />
                </div>
            }
        >
            Copy Token Address
        </Tooltip>
    );
};

export const WithdrawZCToken = ({
    isOpen,
    onClose,
    zcBondList,
    selected,
    source,
}: {
    zcBondList: Record<
        string,
        {
            symbol: CurrencySymbol;
            key: string;
            availableTokenAmount: bigint;
            availableAmount: bigint;
            maturity?: Maturity;
        }
    >;
    selected?: CurrencySymbol;
} & DialogState) => {
    const { blockExplorerUrl } = useBlockExplorerUrl();
    const handleContractTransaction = useHandleContractTransaction();
    const { address } = useAccount();
    const [asset, setAsset] = useState<string>();
    const [currencySymbol, setCurrencySymbol] = useState(CurrencySymbol.ETH);
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [collateral, setCollateral] = useState<bigint>();
    const [txHash, setTxHash] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState(
        'Your withdrawal transaction has failed.'
    );

    const { data: priceList } = useLastPrices();
    const { onWithdrawZCToken } = useWithdrawZCToken(
        currencySymbol,
        (asset && zcBondList[asset]?.maturity) || new Maturity(0),
        collateral ?? BigInt(0)
    );

    const formatOption = (option: {
        symbol: CurrencySymbol;
        key: string;
        availableTokenAmount: bigint;
        availableAmount: bigint;
        maturity?: Maturity;
    }) => {
        const available = convertZCTokenFromBaseAmount(
            option.symbol,
            option.availableTokenAmount,
            option.maturity
        );
        return {
            label: convertToZcTokenName(option.symbol, option.maturity),
            value: option.key,
            note: `${formatAmount(available)} Available`,
            icon: (
                <CopyTokenAddressButton
                    symbol={option.symbol}
                    maturity={option.maturity || new Maturity(0)}
                />
            ),
        };
    };

    const zcBondOptions = useMemo(
        () => Object.values(zcBondList).map(formatOption),
        [zcBondList]
    );

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        if (state.currentStep === Step.withdrawZCBonds) {
            trackButtonEvent(
                ButtonEvents.CANCEL_BUTTON,
                ButtonProperties.CANCEL_ACTION,
                'Cancel Withdraw ZC Bonds'
            );
        }
        setCollateral(undefined);
        onClose();
    }, [onClose, state.currentStep]);

    const isDisabled = useCallback(() => {
        return (
            state.currentStep === Step.withdrawZCBonds &&
            (!collateral ||
                !asset ||
                collateral > zcBondList[asset]?.availableTokenAmount)
        );
    }, [asset, collateral, zcBondList, state.currentStep]);

    const handleWithdrawZCToken = useCallback(async () => {
        try {
            const tx = await onWithdrawZCToken();
            const transactionStatus = await handleContractTransaction(tx);
            if (!transactionStatus) {
                dispatch({ type: 'error' });
            } else {
                trackCollateralEvent(
                    CollateralEvents.WITHDRAW_COLLATERAL,
                    currencySymbol,
                    collateral ?? BigInt(0),
                    source ?? ''
                );
                setTxHash(tx);
                dispatch({ type: 'next' });
            }
        } catch (e) {
            if (e instanceof Error) {
                setErrorMessage(e.message);
            }
            dispatch({ type: 'error' });
        }
    }, [
        currencySymbol,
        collateral,
        handleContractTransaction,
        onWithdrawZCToken,
        source,
    ]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.withdrawZCBonds:
                    dispatch({ type: 'next' });
                    handleWithdrawZCToken();
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
        [handleWithdrawZCToken, handleClose]
    );

    const handleChange = useCallback(
        (currencySymbol: CurrencySymbol, asset: string) => {
            setCurrencySymbol(currencySymbol);
            setAsset(asset);
            setCollateral(undefined);
        },
        []
    );

    const handleCollateral = useCallback((v: bigint | undefined) => {
        setCollateral(v);
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
            showCancelButton={state.currentStep === Step.withdrawZCBonds}
        >
            {(() => {
                switch (state.currentStep) {
                    case Step.withdrawZCBonds:
                        return (
                            <div className='flex flex-col gap-6'>
                                <Selector
                                    headerText='Select Asset'
                                    optionList={zcBondOptions}
                                    onChange={v => {
                                        const zcBond = zcBondList[v.value];

                                        if (zcBond.key !== asset) {
                                            handleChange(
                                                zcBond.symbol,
                                                zcBond.key
                                            );
                                        }
                                    }}
                                    selectedOption={
                                        selected
                                            ? formatOption(zcBondList[selected])
                                            : undefined
                                    }
                                />
                                <ZCTokenInput
                                    price={priceList[currencySymbol]}
                                    availableTokenAmount={
                                        asset
                                            ? zcBondList[asset]
                                                  ?.availableTokenAmount
                                            : BigInt(0)
                                    }
                                    availableAmount={
                                        asset
                                            ? zcBondList[asset]?.availableAmount
                                            : BigInt(0)
                                    }
                                    onAmountChange={handleCollateral}
                                    symbol={currencySymbol}
                                    amount={collateral}
                                    maturity={
                                        asset
                                            ? zcBondList[asset]?.maturity
                                            : undefined
                                    }
                                />
                                <div className='typography-caption-2 h-fit rounded-xl border border-red px-3 py-2 text-slateGray'>
                                    Please note that withdrawal may impact the
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
                                            convertZCTokenFromBaseAmount(
                                                currencySymbol,
                                                collateral || BigInt(0),
                                                asset
                                                    ? zcBondList[asset]
                                                          ?.maturity
                                                    : undefined
                                            )
                                        )}`,
                                    ],
                                ]}
                                txHash={txHash}
                                blockExplorerUrl={blockExplorerUrl}
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
