import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { DelistedCurrencyDisclaimer } from './DelistedCurrencyDisclaimer';

export default {
    title: 'Atoms/DelistedCurrencyDisclaimer',
    component: DelistedCurrencyDisclaimer,
    args: {
        currencies: new Set([CurrencySymbol.WFIL]),
    },
} as Meta<typeof DelistedCurrencyDisclaimer>;

const Template: StoryFn<typeof DelistedCurrencyDisclaimer> = args => (
    <DelistedCurrencyDisclaimer {...args} />
);

export const Default = Template.bind({});
export const TwoCurrencies = Template.bind({});
TwoCurrencies.args = {
    currencies: new Set([CurrencySymbol.WFIL, CurrencySymbol.ETH]),
};

export const MultipleCurrencies = Template.bind({});
MultipleCurrencies.args = {
    currencies: new Set([
        CurrencySymbol.WFIL,
        CurrencySymbol.ETH,
        CurrencySymbol.USDC,
    ]),
};
