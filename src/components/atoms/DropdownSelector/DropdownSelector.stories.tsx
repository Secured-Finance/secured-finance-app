import { ComponentMeta, ComponentStory } from '@storybook/react';
import BitcoinIcon from 'src/assets/coins/btc.svg';
import EthIcon from 'src/assets/coins/eth2.svg';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import UsdtIcon from 'src/assets/coins/usdt.svg';
import { DropdownSelector, Option } from './DropdownSelector';

const optionList = [
    {
        label: 'Bitcoin',
        iconSVG: BitcoinIcon,
        value: 'BTC',
    },
    {
        label: 'Ethereum',
        iconSVG: EthIcon,
        value: 'ETH',
    },
    {
        label: 'Filecoin',
        iconSVG: FilecoinIcon,
        value: 'FIL',
    },
    {
        label: 'USDC',
        iconSVG: UsdcIcon,
        value: 'USDC',
    },
    {
        label: 'USD Tether',
        iconSVG: UsdtIcon,
        value: 'USDT',
    },
] as Array<Option>;

export default {
    title: 'Atoms/DropdownSelector',
    component: DropdownSelector,
    args: {
        optionList,
        selected: optionList[0],
        onChange: (_v: string) => {},
    },
    argTypes: {
        optionList: {
            name: 'The list of options to display the the dropdown selector',
            control: { disable: true },
        },
        onChange: { control: { disable: true }, action: 'onChange' },
    },
} as ComponentMeta<typeof DropdownSelector>;

const Template: ComponentStory<typeof DropdownSelector> = args => (
    <DropdownSelector {...args} />
);

export const AssetDropdown = Template.bind({});
export const TermDropdown = Template.bind({});
TermDropdown.args = {
    optionList: [
        { label: 'Sep 2022', value: 'Sep2022' },
        { label: 'Dec 2022', value: 'Dec2022' },
        { label: 'Mar 2023', value: 'Mar2023' },
        { label: 'Jun 2023', value: 'Jun2023' },
    ],
    selected: { label: 'Sep 2022', value: 'Sep2022' },
};
export const LongSelectionDropdown = Template.bind({});
LongSelectionDropdown.args = {
    optionList: [
        { label: 'Sep 2022', value: 'Sep2022' },
        { label: 'Dec 2022', value: 'Dec2022' },
        { label: 'Mar 2023', value: 'Mar2023' },
        { label: 'Jun 2023', value: 'Jun2023' },
        { label: 'Sep 2023', value: 'Sep2023' },
        { label: 'Dec 2023', value: 'Dec2023' },
        { label: 'Mar 2024', value: 'Mar2024' },
        { label: 'Jun 2024', value: 'Jun2024' },
        { label: 'Sep 2024', value: 'Sep2024' },
        { label: 'Dec 2024', value: 'Dec2024' },
    ],
    selected: { label: 'Sep 2022', value: 'Sep2022' },
};
