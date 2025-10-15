import {
    ValidationResult,
    composeValidators,
    createValidator,
} from 'src/store/utils';

const isValidNumber = createValidator<string>(
    (value: string) => !isNaN(parseFloat(value)) && isFinite(parseFloat(value)),
    'Must be a valid number'
);

const isPositiveNumber = createValidator<string>(
    (value: string) => parseFloat(value) >= 0,
    'Must be a positive number'
);

const isInUnitPriceRange = createValidator<string>((value: string) => {
    const num = parseFloat(value);
    return num >= 1 && num <= 100;
}, 'Unit price must be between 1 and 100');

const isNotEmpty = createValidator<string>(
    (value: string) => value.trim() !== '',
    'Field cannot be empty'
);

// Composite validators
export const validateUnitPrice = (
    value: string | undefined
): ValidationResult<string | undefined> => {
    // Allow undefined or empty string
    if (value === undefined || value === '') {
        return {
            isValid: true,
            data: undefined,
        };
    }

    // Validate non-empty values
    const validator = composeValidators<string>(
        isValidNumber,
        isInUnitPriceRange
    );

    return validator(value);
};

export const validateAmount = (value: string): ValidationResult<string> => {
    // Allow empty string (optional field)
    if (value === '') {
        return {
            isValid: true,
            data: value,
        };
    }

    // Validate non-empty values
    const validator = composeValidators<string>(
        isValidNumber,
        isPositiveNumber
    );

    return validator(value);
};

// Additional validators for future use
export const validateRequiredAmount = (
    value: string
): ValidationResult<string> => {
    const validator = composeValidators<string>(
        isNotEmpty,
        isValidNumber,
        isPositiveNumber
    );

    return validator(value);
};

export const validateRequiredUnitPrice = (
    value: string | undefined
): ValidationResult<string> => {
    if (value === undefined || value === '') {
        return {
            isValid: false,
            errors: ['Unit price is required'],
        };
    }

    const validator = composeValidators<string>(
        isValidNumber,
        isInUnitPriceRange
    );

    return validator(value);
};
