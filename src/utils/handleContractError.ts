import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { BaseError, ContractFunctionRevertedError } from 'viem';

export const handleContractError = (
    error: unknown,
    setErrorMessage: (msg: string) => void,
    dispatch: (action: { type: string }) => void,
    globalDispatch?: Dispatch<PayloadAction<string>>,
    setLastMessageAction?: (message: string) => PayloadAction<string>,
): void => {
    if (error instanceof BaseError) {
        const revertError = error.walk(
            e => e instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
            if (revertError.data?.errorName) {
                setErrorMessage(revertError.data.errorName);
                if (globalDispatch && setLastMessageAction) {
                    globalDispatch(
                        setLastMessageAction(revertError.data.errorName),
                    );
                }
                dispatch({ type: 'error' });
                return;
            }
        }
    }

    if (error instanceof Error) {
        setErrorMessage(error.message);
        if (globalDispatch && setLastMessageAction) {
            globalDispatch(setLastMessageAction(error.message));
        }
    }

    dispatch({ type: 'error' });
};
