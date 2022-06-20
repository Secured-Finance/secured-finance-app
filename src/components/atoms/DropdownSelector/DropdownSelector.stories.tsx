import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ReactComponent as EthIcon } from 'src/assets/coins/eth2.svg';
import { ReactComponent as FilecoinIcon } from 'src/assets/coins/fil.svg';
import { ReactComponent as UsdcIcon } from 'src/assets/coins/usdc.svg';
import { ReactComponent as UsdtIcon } from 'src/assets/coins/usdt.svg';
import { ReactComponent as BitcoinIcon } from 'src/assets/coins/xbc.svg';
import { DropdownSelector, Option } from './DropdownSelector';

const optionList = [
    {
        name: 'Bitcoin',
        Icon: BitcoinIcon,
    },
    {
        name: 'Ethereum',
        Icon: EthIcon,
    },
    {
        name: 'Filecoin',
        Icon: FilecoinIcon,
    },
    {
        name: 'USDC',
        Icon: UsdcIcon,
    },
    {
        name: 'USD Tether',
        Icon: UsdtIcon,
    },
] as Array<Option>;

export default {
    title: 'Atoms/DropdownSelector',
    component: DropdownSelector,
    args: {
        optionList,
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
