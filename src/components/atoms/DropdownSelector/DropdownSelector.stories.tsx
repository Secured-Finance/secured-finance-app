import { ComponentMeta, ComponentStory } from '@storybook/react';
import EthIcon from 'src/assets/coins/eth2.svg';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import UsdtIcon from 'src/assets/coins/usdt.svg';
import BitcoinIcon from 'src/assets/coins/xbc.svg';
import { DropdownSelector, Option } from './DropdownSelector';

const optionList = [
    {
        name: 'Bitcoin',
        iconSVG: BitcoinIcon,
        value: 'BTC',
    },
    {
        name: 'Ethereum',
        iconSVG: EthIcon,
        value: 'ETH',
    },
    {
        name: 'Filecoin',
        iconSVG: FilecoinIcon,
        value: 'FIL',
    },
    {
        name: 'USDC',
        iconSVG: UsdcIcon,
        value: 'USDC',
    },
    {
        name: 'USD Tether',
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
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof DropdownSelector>;

const Template: ComponentStory<typeof DropdownSelector> = args => (
    <DropdownSelector {...args} />
);

export const AssetDropdown = Template.bind({});
export const TermDropdown = Template.bind({});
TermDropdown.args = {
    optionList: [
        { name: 'Sep 2022', value: 'Sep2022' },
        { name: 'Dec 2022', value: 'Dec2022' },
        { name: 'Mar 2023', value: 'Mar2023' },
        { name: 'Jun 2023', value: 'Jun2023' },
    ],
    selected: { name: 'Sep 2022', value: 'Sep2022' },
};
export const LongSelectionDropdown = Template.bind({});
LongSelectionDropdown.args = {
    optionList: [
        { name: 'Sep 2022', value: 'Sep2022' },
        { name: 'Dec 2022', value: 'Dec2022' },
        { name: 'Mar 2023', value: 'Mar2023' },
        { name: 'Jun 2023', value: 'Jun2023' },
        { name: 'Sep 2023', value: 'Sep2023' },
        { name: 'Dec 2023', value: 'Dec2023' },
        { name: 'Mar 2024', value: 'Mar2024' },
        { name: 'Jun 2024', value: 'Jun2024' },
        { name: 'Sep 2024', value: 'Sep2024' },
        { name: 'Dec 2024', value: 'Dec2024' },
    ],
    selected: { name: 'Sep 2022', value: 'Sep2022' },
};
