import React from 'react';
import { TransactionStatus } from 'src/store/transaction/types';

export default function SettlementValidation({
    status,
    transactionHash,
    error,
}: {
    status: TransactionStatus;
    transactionHash?: string;
    error?: string;
}) {
    const child = () => {
        switch (status) {
            case TransactionStatus.Pending:
                return <>Waiting for confirmation...</>;
            case TransactionStatus.Confirmed:
                return (
                    <>
                        <div>Transaction confirmed!</div>
                        <div>
                            <a
                                href={`https://etherscan.io/tx/${transactionHash}`}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                View on Etherscan
                            </a>
                        </div>
                    </>
                );
            case TransactionStatus.Settled:
                return <>Settlement complete! with ${transactionHash}</>;
            case TransactionStatus.Error:
                return (
                    <>
                        <div>Transaction failed! {error}</div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className='text-white' data-cy='settlement-validation'>
            {child()}
        </div>
    );
}
