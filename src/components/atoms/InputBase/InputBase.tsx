import classNames from 'classnames';
import NumericFormat, {
    NumberFormatValues,
    SourceInfo,
} from 'react-number-format';
import { FontSize } from 'src/types';

interface InputBaseProps {
    className?: string;
    value?: number;
    onValueChange: (v: number | undefined) => void;
    label?: string;
    decimalPlacesAllowed?: number;
    maxLimit?: number;
    fontSize?: Record<FontSize, number>;
}
const DEFAULT_FONTSIZE: Record<FontSize, number> = {
    small: 12,
    large: 15,
};
export const InputBase = ({
    className,
    value,
    onValueChange,
    label,
    decimalPlacesAllowed = 4,
    maxLimit = 10 ** 10,
    fontSize = DEFAULT_FONTSIZE,
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
        'text-md': value && value.toString().length >= fontSize.large,
        'text-lg':
            value &&
            value.toString().length >= fontSize.small &&
            value.toString().length < fontSize.large,
        'text-xl':
            !value || (value && value.toString().length < fontSize.small),
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
