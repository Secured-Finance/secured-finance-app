import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { AmountCard } from './AmountCard';

export default {
    title: 'Molecules/AmountCard',
    component: AmountCard,
    args: {
        amount: new Amount('5000000000000000000000', CurrencySymbol.EFIL),
        price: 8.3,
    },
} as ComponentMeta<typeof AmountCard>;

const Template: ComponentStory<typeof AmountCard> = args => (
    <AmountCard {...args} />
);

export const Default = Template.bind({});
