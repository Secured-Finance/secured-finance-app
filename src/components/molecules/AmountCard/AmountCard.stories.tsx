import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { AmountCard } from './AmountCard';

export default {
    title: 'Molecules/AmountCard',
    component: AmountCard,
    args: {
        ccy: CurrencySymbol.FIL,
        amount: 5000,
        price: 8.3,
    },
} as ComponentMeta<typeof AmountCard>;

const Template: ComponentStory<typeof AmountCard> = args => (
    <AmountCard {...args} />
);

export const Default = Template.bind({});
