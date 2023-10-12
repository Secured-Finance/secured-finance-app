import { DelistingChip, DropdownSelector, Option } from 'src/components/atoms';
import { useCurrencyDelistedStatus } from 'src/hooks';
import { CurrencySymbol, currencyMap } from 'src/utils';

export type CurrencyOption = Pick<Option<CurrencySymbol>, 'label' | 'value'>;

export const CurrencyDropdown = ({
    currencyOptionList,
    selected,
    onChange,
}: {
    currencyOptionList: Readonly<Array<CurrencyOption>>;
    selected?: CurrencyOption;
    onChange: (v: CurrencyOption['value']) => void;
}) => {
    const isDelisted = useCurrencyDelistedStatus().data;

    const optionList = currencyOptionList.map(o => ({
        ...o,
        iconSVG: currencyMap[o.value].icon,
        ...(isDelisted?.[o.value] ? { chip: <DelistingChip /> } : {}),
    }));

    return (
        <DropdownSelector
            optionList={optionList}
            selected={selected}
            onChange={onChange}
            variant='fixedWidth'
        />
    );
};
