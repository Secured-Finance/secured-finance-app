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
    switch (status) {
        case TransactionStatus.Pending:
            return (
                <div className='text-white'>Waiting for confirmation...</div>
            );
        case TransactionStatus.Confirmed:
            return (
                <div className='text-white'>
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
                </div>
            );
        case TransactionStatus.Settled:
            return (
                <div className='text-white'>
                    Settlement complete! with ${transactionHash}
                </div>
            );
        case TransactionStatus.Error:
            return (
                <div className='text-white'>
                    <div>Transaction failed! {error}</div>
                </div>
            );
        default:
            return null;
    }
}
