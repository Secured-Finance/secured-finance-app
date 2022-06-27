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
    },
    {
        name: 'Ethereum',
        iconSVG: EthIcon,
    },
    {
        name: 'Filecoin',
        iconSVG: FilecoinIcon,
    },
    {
        name: 'USDC',
        iconSVG: UsdcIcon,
    },
    {
        name: 'USD Tether',
        iconSVG: UsdtIcon,
    },
] as Array<Option>;

export default {
    title: 'Atoms/DropdownSelector',
    component: DropdownSelector,
    args: {
        optionList,
        onChange: (_v: string) => {},
    },
    argTypes: {
        optionList: { control: { disable: true } },
        onChange: { action: 'onChange' },
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
        { name: 'Sep 2022' },
        { name: 'Dec 2022' },
        { name: 'Mar 2023' },
        { name: 'Jun 2023' },
    ],
};
export const LongSelectionDropdown = Template.bind({});
LongSelectionDropdown.args = {
    optionList: [
        { name: 'Sep 2022' },
        { name: 'Dec 2022' },
        { name: 'Mar 2023' },
        { name: 'Jun 2023' },
        { name: 'Sep 2023' },
        { name: 'Dec 2023' },
        { name: 'Mar 2024' },
        { name: 'Jun 2024' },
        { name: 'Sep 2024' },
        { name: 'Dec 2024' },
    ],
};
