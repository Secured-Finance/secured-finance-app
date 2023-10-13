import type { Meta, StoryFn } from '@storybook/react';
import { DelistedCurrencyDisclaimer } from './DelistedCurrencyDisclaimer';

export default {
    title: 'Atoms/DelistedCurrencyDisclaimer',
    component: DelistedCurrencyDisclaimer,
    args: {
        currencies: ['WFIL'],
    },
} as Meta<typeof DelistedCurrencyDisclaimer>;

const Template: StoryFn<typeof DelistedCurrencyDisclaimer> = args => (
    <DelistedCurrencyDisclaimer {...args} />
);

export const Default = Template.bind({});
export const TwoCurrencies = Template.bind({});
TwoCurrencies.args = {
    currencies: ['WFIL', 'ETH'],
};

export const MultipleCurrencies = Template.bind({});
MultipleCurrencies.args = {
    currencies: ['WFIL', 'ETH', 'USDC'],
};
