/**
 * Shared utilities for Zustand stores
 */
export interface ValidationResult<T> {
    isValid: boolean;
    data?: T;
    errors?: string[];
}

export type ValidatorFunction<T> = (value: T) => ValidationResult<T>;

export const createResetAction =
    <T>(defaultState: T) =>
    () =>
        defaultState;

export interface BaseStoreActions {
    resetStore: () => void;
}

export type StoreCreator<S, A> = S & A & BaseStoreActions;

export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export interface EnhancedError {
    message: string;
    severity: ErrorSeverity;
    timestamp: number;
    context?: Record<string, unknown>;
}

export const createValidator = <T>(
    validationFn: (value: T) => boolean,
    errorMessage: string
): ValidatorFunction<T> => {
    return (value: T): ValidationResult<T> => {
        const isValid = validationFn(value);
        return {
            isValid,
            data: isValid ? value : undefined,
            errors: isValid ? undefined : [errorMessage],
        };
    };
};

export const composeValidators = <T>(
    ...validators: ValidatorFunction<T>[]
): ValidatorFunction<T> => {
    return (value: T): ValidationResult<T> => {
        const errors: string[] = [];

        for (const validator of validators) {
            const result = validator(value);
            if (!result.isValid && result.errors) {
                errors.push(...result.errors);
            }
        }

        return {
            isValid: errors.length === 0,
            data: errors.length === 0 ? value : undefined,
            errors: errors.length > 0 ? errors : undefined,
        };
    };
};
