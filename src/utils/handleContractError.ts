import { BaseError, ContractFunctionRevertedError } from 'viem';

export const handleContractError = (
    error: unknown,
    setErrorMessage: (msg: string) => void,
    dispatch: (action: { type: string }) => void,
    setLastErrorMessage?: (message: string) => void
): void => {
    if (error instanceof BaseError) {
        const revertError = error.walk(
            e => e instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
            if (revertError.data?.errorName) {
                setErrorMessage(revertError.data.errorName);
                setLastErrorMessage?.(revertError.data.errorName);
                dispatch({ type: 'error' });
                return;
            }
        }
    }

    if (error instanceof Error) {
        setErrorMessage(error.message);
        setLastErrorMessage?.(error.message);
    }

    dispatch({ type: 'error' });
};
