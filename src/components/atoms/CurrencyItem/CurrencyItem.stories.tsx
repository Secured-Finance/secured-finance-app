import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CurrencyItem } from './CurrencyItem';

export default {
    title: 'Atoms/CurrencyItem',
    component: CurrencyItem,
    args: {
        amount: 1000,
        ccy: CurrencySymbol.WFIL,
        price: 8.2,
        align: 'left',
    },
    argTypes: {
        align: {
            control: {
                type: 'select',
                options: ['left', 'right', 'center'],
            },
        },
    },
} as Meta<typeof CurrencyItem>;

const Template: StoryFn<typeof CurrencyItem> = args => (
    <CurrencyItem {...args} />
);

export const Default = Template.bind({});
export const CurrencyPrice = Template.bind({});
CurrencyPrice.args = {
    amount: undefined,
    ccy: CurrencySymbol.WFIL,
    price: 8.2,
    align: 'left',
};

export const CurrencyName = Template.bind({});
CurrencyName.args = {
    amount: undefined,
    ccy: CurrencySymbol.WFIL,
    price: undefined,
    align: 'left',
};

export const CurrencyAmountInColor = Template.bind({});
CurrencyAmountInColor.args = {
    amount: 1000,
    ccy: CurrencySymbol.WFIL,
    price: 8.2,
    align: 'left',
    color: 'positive',
};

export const Compact = Template.bind({});
Compact.args = {
    amount: 1000,
    ccy: CurrencySymbol.WFIL,
    price: 8.2,
    align: 'left',
    compact: true,
};
