import classNames from 'classnames';
import NumericFormat, {
    NumberFormatValues,
    SourceInfo,
} from 'react-number-format';

export type SizeDependentStylesConfig = Record<
    'shortText' | 'mediumText' | 'longText',
    { maxChar: number; styles: string }
>;

interface InputBaseProps {
    className?: string;
    value?: string;
    onValueChange: (v: string | undefined) => void;
    label?: string;
    decimalPlacesAllowed?: number;
    maxLimit?: number;
    sizeDependentStyles?: SizeDependentStylesConfig;
}

export const InputBase = ({
    className,
    value,
    onValueChange,
    label,
    decimalPlacesAllowed = 4,
    maxLimit = 10 ** 10,
    sizeDependentStyles,
}: InputBaseProps) => {
    const handleValueChange = (
        values: NumberFormatValues,
        _sourceInfo: SourceInfo
    ) => {
        const value = values.value;
        if (onValueChange) {
            onValueChange(value);
        }
    };

    const fontSizeClass = sizeDependentStyles
        ? classNames({
              [sizeDependentStyles.shortText.styles]:
                  !value ||
                  (value &&
                      value.toString().length <=
                          sizeDependentStyles.shortText.maxChar),
              [sizeDependentStyles.mediumText.styles]:
                  value &&
                  value.toString().length >
                      sizeDependentStyles.shortText.maxChar &&
                  value.toString().length <=
                      sizeDependentStyles.mediumText.maxChar,
              [sizeDependentStyles.longText.styles]:
                  value &&
                  value.toString().length >
                      sizeDependentStyles.mediumText.maxChar &&
                  value.toString().length <=
                      sizeDependentStyles.longText.maxChar,
          })
        : null;

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
            value={value ?? ''}
            displayType='input'
            onValueChange={handleValueChange}
            aria-label={label}
            decimalScale={decimalPlacesAllowed}
            isAllowed={values => {
                const { floatValue = 0 } = values;
                return floatValue <= maxLimit;
            }}
            inputMode='decimal'
        />
    );
};
