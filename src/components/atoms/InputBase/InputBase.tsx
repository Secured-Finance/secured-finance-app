import classNames from 'classnames';
import NumericFormat, {
    NumberFormatValues,
    SourceInfo,
} from 'react-number-format';

interface InputBaseProps {
    className?: string;
    value?: number;
    onValueChange: (v: number | undefined) => void;
    label?: string;
    decimalPlacesAllowed?: number;
    maxLimit?: number;
}

export const InputBase = ({
    className,
    value,
    onValueChange,
    label,
    decimalPlacesAllowed = 4,
    maxLimit = Number.MAX_SAFE_INTEGER, // we should have a better estimation of this maxLimit
}: InputBaseProps) => {
    const handleValueChange = (
        values: NumberFormatValues,
        _sourceInfo: SourceInfo
    ) => {
        const value = values.floatValue;
        if (onValueChange) {
            onValueChange(value);
        }
    };

    const fontSizeClass = classNames({
        'text-xs': value && value.toString().length >= 20,
        'text-sm':
            value &&
            value.toString().length >= 15 &&
            value.toString().length < 20,
        'text-md':
            value &&
            value.toString().length >= 8 &&
            value.toString().length < 15,
        'text-lg': value && value.toString().length < 8,
    });

    return (
        <NumericFormat
            className={classNames(
                'bg-transparent placeholder-opacity-50 focus:outline-none',
                className,
                fontSizeClass
            )}
            placeholder='0'
            thousandSeparator={true}
            allowNegative={false}
            value={value}
            displayType='input'
            onValueChange={handleValueChange}
            aria-label={label}
            decimalScale={decimalPlacesAllowed}
            isAllowed={values => {
                const { floatValue = 0 } = values;
                return floatValue <= maxLimit;
            }}
        />
    );
};
