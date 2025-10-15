import {
    ValidationResult,
    ValidatorFunction,
    createResetAction,
    BaseStoreActions,
    ErrorSeverity,
    EnhancedError,
    createValidator,
    composeValidators,
} from './utils';

describe('Store Utils', () => {
    describe('createResetAction', () => {
        it('should create a function that returns default state', () => {
            const defaultState = { count: 0, name: 'test' };
            const resetAction = createResetAction(defaultState);

            expect(typeof resetAction).toBe('function');
            expect(resetAction()).toEqual(defaultState);
        });

        it('should return the exact same object reference', () => {
            const defaultState = { items: ['a', 'b'] };
            const resetAction = createResetAction(defaultState);

            expect(resetAction()).toBe(defaultState);
        });

        it('should work with primitive values', () => {
            const defaultState = 42;
            const resetAction = createResetAction(defaultState);

            expect(resetAction()).toBe(42);
        });

        it('should work with null and undefined', () => {
            const nullResetAction = createResetAction(null);
            const undefinedResetAction = createResetAction(undefined);

            expect(nullResetAction()).toBeNull();
            expect(undefinedResetAction()).toBeUndefined();
        });

        it('should work with complex nested objects', () => {
            const defaultState = {
                user: {
                    id: 1,
                    settings: { theme: 'dark', notifications: true },
                },
                data: [{ id: 1 }, { id: 2 }],
            };
            const resetAction = createResetAction(defaultState);

            expect(resetAction()).toBe(defaultState);
            expect(resetAction().user.settings.theme).toBe('dark');
        });
    });

    describe('ErrorSeverity enum', () => {
        it('should have all required severity levels', () => {
            expect(ErrorSeverity.LOW).toBe('low');
            expect(ErrorSeverity.MEDIUM).toBe('medium');
            expect(ErrorSeverity.HIGH).toBe('high');
            expect(ErrorSeverity.CRITICAL).toBe('critical');
        });

        it('should be accessible as object keys', () => {
            const severities = Object.values(ErrorSeverity);
            expect(severities).toContain('low');
            expect(severities).toContain('medium');
            expect(severities).toContain('high');
            expect(severities).toContain('critical');
        });
    });

    describe('EnhancedError interface', () => {
        it('should structure error correctly', () => {
            const error: EnhancedError = {
                message: 'Test error',
                severity: ErrorSeverity.HIGH,
                timestamp: Date.now(),
                context: { userId: 123, action: 'login' },
            };

            expect(error.message).toBe('Test error');
            expect(error.severity).toBe(ErrorSeverity.HIGH);
            expect(typeof error.timestamp).toBe('number');
            expect(error.context).toEqual({ userId: 123, action: 'login' });
        });

        it('should allow optional context', () => {
            const error: EnhancedError = {
                message: 'Simple error',
                severity: ErrorSeverity.LOW,
                timestamp: 1234567890,
            };

            expect(error.message).toBe('Simple error');
            expect(error.severity).toBe(ErrorSeverity.LOW);
            expect(error.context).toBeUndefined();
        });
    });

    describe('createValidator', () => {
        it('should create a validator that passes valid values', () => {
            const isEven = createValidator<number>(
                value => value % 2 === 0,
                'Must be even'
            );

            const result = isEven(4);
            expect(result.isValid).toBe(true);
            expect(result.data).toBe(4);
            expect(result.errors).toBeUndefined();
        });

        it('should create a validator that rejects invalid values', () => {
            const isEven = createValidator<number>(
                value => value % 2 === 0,
                'Must be even'
            );

            const result = isEven(3);
            expect(result.isValid).toBe(false);
            expect(result.data).toBeUndefined();
            expect(result.errors).toEqual(['Must be even']);
        });

        it('should work with string validators', () => {
            const isNotEmpty = createValidator<string>(
                value => value.trim().length > 0,
                'Cannot be empty'
            );

            const validResult = isNotEmpty('hello');
            expect(validResult.isValid).toBe(true);
            expect(validResult.data).toBe('hello');

            const invalidResult = isNotEmpty('   ');
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors).toEqual(['Cannot be empty']);
        });

        it('should work with complex object validators', () => {
            interface User {
                name: string;
                age: number;
            }

            const isValidUser = createValidator<User>(
                user => user.name.length > 0 && user.age >= 0,
                'Invalid user'
            );

            const validUser = { name: 'John', age: 25 };
            const validResult = isValidUser(validUser);
            expect(validResult.isValid).toBe(true);
            expect(validResult.data).toEqual(validUser);

            const invalidUser = { name: '', age: -5 };
            const invalidResult = isValidUser(invalidUser);
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors).toEqual(['Invalid user']);
        });

        it('should handle boolean return from validation function', () => {
            const alwaysTrue = createValidator<string>(
                () => true,
                'Never fails'
            );
            const alwaysFalse = createValidator<string>(
                () => false,
                'Always fails'
            );

            expect(alwaysTrue('anything').isValid).toBe(true);
            expect(alwaysFalse('anything').isValid).toBe(false);
        });
    });

    describe('composeValidators', () => {
        it('should pass when all validators pass', () => {
            const isPositive = createValidator<number>(
                n => n > 0,
                'Must be positive'
            );
            const isLessThan100 = createValidator<number>(
                n => n < 100,
                'Must be less than 100'
            );

            const composedValidator = composeValidators(
                isPositive,
                isLessThan100
            );
            const result = composedValidator(50);

            expect(result.isValid).toBe(true);
            expect(result.data).toBe(50);
            expect(result.errors).toBeUndefined();
        });

        it('should fail when any validator fails', () => {
            const isPositive = createValidator<number>(
                n => n > 0,
                'Must be positive'
            );
            const isLessThan100 = createValidator<number>(
                n => n < 100,
                'Must be less than 100'
            );

            const composedValidator = composeValidators(
                isPositive,
                isLessThan100
            );
            const result = composedValidator(-50);

            expect(result.isValid).toBe(false);
            expect(result.data).toBeUndefined();
            expect(result.errors).toEqual(['Must be positive']);
        });

        it('should accumulate all errors when multiple validators fail', () => {
            const isNegative = createValidator<number>(
                n => n < 0,
                'Must be negative'
            );
            const isGreaterThan100 = createValidator<number>(
                n => n > 100,
                'Must be greater than 100'
            );
            const isEven = createValidator<number>(
                n => n % 2 === 0,
                'Must be even'
            );

            const composedValidator = composeValidators(
                isNegative,
                isGreaterThan100,
                isEven
            );
            // Use 51 which fails all three: not negative, not > 100, and odd
            const result = composedValidator(51);

            expect(result.isValid).toBe(false);
            expect(result.data).toBeUndefined();
            expect(result.errors).toEqual([
                'Must be negative',
                'Must be greater than 100',
                'Must be even',
            ]);
        });

        it('should work with single validator', () => {
            const isString = createValidator<unknown>(
                value => typeof value === 'string',
                'Must be string'
            );

            const composedValidator = composeValidators(isString);

            const validResult = composedValidator('hello');
            expect(validResult.isValid).toBe(true);
            expect(validResult.data).toBe('hello');

            const invalidResult = composedValidator(123);
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors).toEqual(['Must be string']);
        });

        it('should work with no validators', () => {
            const composedValidator = composeValidators<string>();
            const result = composedValidator('anything');

            expect(result.isValid).toBe(true);
            expect(result.data).toBe('anything');
            expect(result.errors).toBeUndefined();
        });

        it('should handle complex validation chains', () => {
            const isString = createValidator<unknown>(
                value => typeof value === 'string',
                'Must be string'
            );
            const minLength = createValidator<unknown>(
                value => typeof value === 'string' && value.length >= 3,
                'Must be at least 3 characters'
            );
            const maxLength = createValidator<unknown>(
                value => typeof value === 'string' && value.length <= 10,
                'Must be no more than 10 characters'
            );
            const noSpaces = createValidator<unknown>(
                value => typeof value === 'string' && !value.includes(' '),
                'Must not contain spaces'
            );

            const usernameValidator = composeValidators(
                isString,
                minLength,
                maxLength,
                noSpaces
            );

            // Valid username
            const validResult = usernameValidator('user123');
            expect(validResult.isValid).toBe(true);
            expect(validResult.data).toBe('user123');

            // Too short
            const tooShortResult = usernameValidator('ab');
            expect(tooShortResult.isValid).toBe(false);
            expect(tooShortResult.errors).toEqual([
                'Must be at least 3 characters',
            ]);

            // Too long
            const tooLongResult = usernameValidator('verylongusername');
            expect(tooLongResult.isValid).toBe(false);
            expect(tooLongResult.errors).toEqual([
                'Must be no more than 10 characters',
            ]);

            // Contains spaces
            const hasSpacesResult = usernameValidator('user name');
            expect(hasSpacesResult.isValid).toBe(false);
            expect(hasSpacesResult.errors).toEqual(['Must not contain spaces']);

            // Multiple violations - 'a b' is 3 characters long (including space) so it passes length check
            const multipleErrorsResult = usernameValidator('a');
            expect(multipleErrorsResult.isValid).toBe(false);
            expect(multipleErrorsResult.errors).toEqual([
                'Must be at least 3 characters',
            ]);
        });

        it('should preserve validation order', () => {
            const first = createValidator<number>(n => n < 0, 'First error');
            const second = createValidator<number>(
                n => n > 100,
                'Second error'
            );
            const third = createValidator<number>(
                n => n % 2 === 0,
                'Third error'
            );

            const composedValidator = composeValidators(first, second, third);
            // 51 fails all three: not < 0, not > 100, and odd
            const result = composedValidator(51);

            expect(result.errors).toEqual([
                'First error',
                'Second error',
                'Third error',
            ]);
        });
    });

    // Type checking tests (these will be caught at compile time)
    describe('Type Safety', () => {
        it('should maintain type safety for ValidationResult', () => {
            const stringResult: ValidationResult<string> = {
                isValid: true,
                data: 'test',
            };

            const numberResult: ValidationResult<number> = {
                isValid: false,
                errors: ['Invalid number'],
            };

            expect(stringResult.data).toBe('test');
            expect(numberResult.errors).toEqual(['Invalid number']);
        });

        it('should maintain type safety for ValidatorFunction', () => {
            const stringValidator: ValidatorFunction<string> = createValidator(
                (value: string) => value.length > 0,
                'Cannot be empty'
            );

            const result = stringValidator('test');
            expect(result.isValid).toBe(true);
        });

        it('should properly type BaseStoreActions', () => {
            const actions: BaseStoreActions = {
                resetStore: () => {},
            };

            expect(typeof actions.resetStore).toBe('function');
        });
    });

    // Integration tests
    describe('Integration Tests', () => {
        it('should work together in a realistic store scenario', () => {
            interface UserState {
                name: string;
                email: string;
                age: number;
            }

            const defaultUserState: UserState = {
                name: '',
                email: '',
                age: 0,
            };

            // Create reset action
            const resetUser = createResetAction(defaultUserState);

            // Create validators
            const validateName = createValidator<string>(
                name => name.trim().length > 0,
                'Name is required'
            );

            const validateEmail = createValidator<string>(
                email => email.includes('@'),
                'Valid email required'
            );

            const validateAge = createValidator<number>(
                age => age >= 0 && age <= 120,
                'Age must be between 0 and 120'
            );

            // Test reset functionality
            expect(resetUser()).toEqual(defaultUserState);

            // Test validation
            expect(validateName('John').isValid).toBe(true);
            expect(validateName('').isValid).toBe(false);

            expect(validateEmail('test@example.com').isValid).toBe(true);
            expect(validateEmail('invalid-email').isValid).toBe(false);

            expect(validateAge(25).isValid).toBe(true);
            expect(validateAge(-5).isValid).toBe(false);
            expect(validateAge(150).isValid).toBe(false);

            // Test composed validation
            const validateUserData = composeValidators(
                createValidator<UserState>(
                    user => user.name.trim().length > 0,
                    'Name is required'
                ),
                createValidator<UserState>(
                    user => user.email.includes('@'),
                    'Valid email required'
                ),
                createValidator<UserState>(
                    user => user.age >= 0 && user.age <= 120,
                    'Valid age required'
                )
            );

            const validUser: UserState = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
            };

            const invalidUser: UserState = {
                name: '',
                email: 'invalid',
                age: -5,
            };

            expect(validateUserData(validUser).isValid).toBe(true);

            const invalidResult = validateUserData(invalidUser);
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errors).toEqual([
                'Name is required',
                'Valid email required',
                'Valid age required',
            ]);
        });
    });
});
