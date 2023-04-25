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
    resizeInputText?: boolean;
}

export const InputBase = ({
    className,
    value,
    onValueChange,
    label,
    decimalPlacesAllowed = 4,
    maxLimit = Number.MAX_SAFE_INTEGER, // we should have a better estimation of this maxLimit
    resizeInputText,
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
        'text-smd': value && value.toString().length >= 15,
        'text-md':
            value &&
            value.toString().length >= 10 &&
            value.toString().length < 15,
        'text-lg': value && value.toString().length < 10,
    });

    return (
        <NumericFormat
            className={classNames(
                'bg-transparent placeholder-opacity-50 focus:outline-none',
                className,
                resizeInputText ? fontSizeClass : null
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
