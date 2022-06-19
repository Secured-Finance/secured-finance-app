import { LogoutIcon, UserIcon } from '@heroicons/react/outline';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DropdownSelector, Option } from './DropdownSelector';

const optionList = [
    {
        name: 'Bitcoin',
        Icon: LogoutIcon,
    },
    {
        name: 'Ethereum',
        Icon: UserIcon,
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

export const AssetSelector = Template.bind({});
export const TermSelector = Template.bind({});
TermSelector.args = {
    optionList: [
        { name: 'Sep 2022' },
        { name: 'Dec 2022' },
        { name: 'Mar 2023' },
        { name: 'Jun 2023' },
    ],
};
export const LongSelection = Template.bind({});
LongSelection.args = {
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
