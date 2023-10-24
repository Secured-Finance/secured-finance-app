import { createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { Section, Spinner } from 'src/components/atoms';
import {
    CollateralSnapshot,
    CoreTable,
    Dialog,
    DialogState,
    FailurePanel,
    SuccessPanel,
} from 'src/components/molecules';
import { useEtherscanUrl, useHandleContractTransaction } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import {
    AddressUtils,
    formatTimestamp,
    percentFormat,
    usdFormat,
} from 'src/utils';

enum Step {
    settlement = 1,
    executing,
    executed,
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
    [Step.settlement]: {
        currentStep: Step.settlement,
        nextStep: Step.executing,
        title: 'Redeem',
        description: '',
        buttonText: 'confirm Redeem',
    },
    [Step.executing]: {
        currentStep: Step.executing,
        nextStep: Step.executed,
        title: 'Redeeming...',
        description: '',
        buttonText: '',
    },
    [Step.executed]: {
        currentStep: Step.executed,
        nextStep: Step.settlement,
        title: 'Success!',
        description: 'Your redemption was successful.',
        buttonText: 'OK',
    },
    [Step.error]: {
        currentStep: Step.error,
        nextStep: Step.settlement,
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
                ...stateRecord[Step.settlement],
            };
    }
};

const columnHelper = createColumnHelper<CollateralSnapshot>();

export const EmergencyRedeemDialog = ({
    isOpen,
    onClose,
    netValue,
    data,
    snapshotDate,
}: {
    netValue: string;
    data: CollateralSnapshot[];
    snapshotDate: number | undefined;
} & DialogState) => {
    const columns = useMemo(
        () => [
            columnHelper.accessor('currency', {
                cell: info => (
                    <div className='flex flex-row items-center gap-2'>
                        <span>{info.getValue()}</span>
                    </div>
                ),
                header: 'Asset',
            }),
            columnHelper.accessor('ratio', {
                cell: info => percentFormat(info.getValue() / 100),
                header: 'Ratio of Collateral',
            }),
            columnHelper.accessor('price', {
                cell: info => (
                    <div className='text-right'>
                        {usdFormat(info.getValue(), 2)}
                    </div>
                ),
                header: 'Snapshot Rate',
            }),
        ],
        []
    );

    const etherscanUrl = useEtherscanUrl();
    const securedFinance = useSF();
    const [state, dispatch] = useReducer(reducer, stateRecord[1]);
    const [errorMessage, setErrorMessage] = useState(
        'Your transaction has failed.'
    );
    const [txHash, setTxHash] = useState<string | undefined>();

    const handleContractTransaction = useHandleContractTransaction();

    const handleClose = useCallback(() => {
        dispatch({ type: 'default' });
        onClose();
    }, [onClose]);

    const handleExecuteSettlement = useCallback(async () => {
        try {
            const tx = await securedFinance?.executeEmergencySettlement();
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
            }

            dispatch({ type: 'error' });
        }
    }, [handleContractTransaction, securedFinance]);

    const onClick = useCallback(
        async (currentStep: Step) => {
            switch (currentStep) {
                case Step.settlement:
                    dispatch({ type: 'next' });
                    handleExecuteSettlement();
                    break;
                case Step.executing:
                    break;
                case Step.executed:
                    handleClose();
                    break;
                case Step.error:
                    handleClose();
                    break;
            }
        },
        [handleClose, handleExecuteSettlement]
    );

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
                    case Step.settlement:
                        return (
                            <div className='flex w-full flex-col gap-6'>
                                <Section>
                                    <div className='typography-caption flex flex-row justify-between font-bold text-white'>
                                        <span>Net Value</span>
                                        <span>{netValue}</span>
                                    </div>
                                </Section>
                                <Section>
                                    <div className='flex flex-col gap-2'>
                                        <CoreTable
                                            data={data}
                                            columns={columns}
                                        />
                                        <div className='typography-caption-2 text-center leading-6 text-slateGray'>{`Snapshot as of ${formatTimestamp(
                                            snapshotDate ?? 0
                                        )}`}</div>
                                    </div>
                                </Section>
                            </div>
                        );
                    case Step.executing:
                        return (
                            <div className='flex h-full w-full items-center justify-center py-9'>
                                <Spinner />
                            </div>
                        );
                        break;
                    case Step.executed:
                        return (
                            <SuccessPanel
                                itemList={[
                                    ['Status', 'Complete'],
                                    [
                                        'Transaction hash',
                                        AddressUtils.format(txHash ?? '', 8),
                                    ],
                                    ['Amount (USD)', netValue],
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
