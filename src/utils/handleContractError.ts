import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { BaseError, ContractFunctionRevertedError } from 'viem';

/**
 * Format error messages into user-friendly text.
 * Parses common error patterns from contract interactions and wallet operations.
 * @param error - The error to format
 * @param depth - Internal recursion depth counter (max 3)
 */
export const formatErrorMessage = (
    error: Error | unknown,
    depth = 0
): string => {
    if (!(error instanceof Error)) {
        return 'An unexpected error occurred';
    }

    // Prevent infinite recursion
    if (depth > 3) {
        return 'An error occurred during the transaction';
    }

    const errorMessage = error.message;

    // User rejected transaction
    if (
        errorMessage.includes('User denied transaction signature') ||
        errorMessage.includes('User rejected')
    ) {
        return 'User rejected the transaction.';
    }

    // Gas limit exceeded
    if (errorMessage.includes('transaction gas limit too high')) {
        const match = errorMessage.match(/cap: (\d+)/);
        const cap = match ? match[1] : 'unknown';
        return `Gas limit exceeded. The transaction requires more gas than allowed (limit: ${cap}). Please try again later.`;
    }

    // Insufficient funds
    if (
        errorMessage.includes('insufficient funds') ||
        errorMessage.includes('insufficient balance')
    ) {
        return 'Insufficient funds to complete the transaction. Please ensure you have enough ETH for gas fees.';
    }

    // Network errors
    if (
        errorMessage.includes('network') ||
        errorMessage.includes('connection')
    ) {
        return 'Network connection error. Please check your connection and try again.';
    }

    // Internal errors
    if (errorMessage.includes('An internal error was received')) {
        // Try to extract the specific error details with improved regex
        const detailsMatch = errorMessage.match(
            /Details:\s*(.+?)(?=\n|Version:|$)/
        );
        if (detailsMatch) {
            const details = detailsMatch[1].trim();
            return formatErrorMessage(new Error(details), depth + 1);
        }
        return 'An internal error occurred. Please try again.';
    }

    // Generic fallback - try to extract a clean message
    const cleanMessage = errorMessage
        .split('Request Arguments:')[0]
        .split('Details:')[0]
        .split('Version:')[0]
        .trim();

    return cleanMessage || 'An error occurred during the transaction';
};

export const handleContractError = (
    error: unknown,
    setErrorMessage: (msg: string) => void,
    dispatch: (action: { type: string }) => void,
    globalDispatch?: Dispatch<PayloadAction<string>>,
    setLastMessageAction?: (message: string) => PayloadAction<string>
): void => {
    if (error instanceof BaseError) {
        const revertError = error.walk(
            e => e instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
            if (revertError.data?.errorName) {
                setErrorMessage(revertError.data.errorName);
                if (globalDispatch && setLastMessageAction) {
                    globalDispatch(
                        setLastMessageAction(revertError.data.errorName)
                    );
                }
                dispatch({ type: 'error' });
                return;
            }
        }
    }

    if (error instanceof Error) {
        const formattedMessage = formatErrorMessage(error);
        setErrorMessage(formattedMessage);
        if (globalDispatch && setLastMessageAction) {
            globalDispatch(setLastMessageAction(formattedMessage));
        }
    }

    dispatch({ type: 'error' });
};
