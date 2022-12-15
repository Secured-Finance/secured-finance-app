import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Option } from 'src/components/atoms';
import { CurrencySymbol } from 'src/utils';
import { AdvancedLendingTopBar } from '.';

const options: Array<Option> = [
    { label: 'SEP22', value: 'Sep2022' },
    { label: 'DEC22', value: 'Dec2022' },
    { label: 'MAR23', value: 'Mar2023' },
    { label: 'JUN23', value: 'Jun2023' },
];

export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
    args: {
        asset: CurrencySymbol.FIL,
        options,
        selected: { label: 'SEP22', value: 'Sep2022' },
    },
} as ComponentMeta<typeof AdvancedLendingTopBar>;

const Template: ComponentStory<typeof AdvancedLendingTopBar> = args => (
    <AdvancedLendingTopBar {...args} />
);

export const Default = Template.bind({});

export const Values = Template.bind({});
Values.args = {
    values: [26.16, 24.2, 894, 10000000],
};
