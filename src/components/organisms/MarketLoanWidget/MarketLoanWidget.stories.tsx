import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    maturities,
    wbtcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { MarketLoanWidget } from './MarketLoanWidget';

const filMarkets = Object.values(maturities).map(m => ({
    ...m,
    currency: wfilBytes32,
    ccy: CurrencySymbol.WFIL,
}));
const btcMarkets = Object.values(maturities).map(m => ({
    ...m,
    currency: wbtcBytes32,
    ccy: CurrencySymbol.WBTC,
}));

export default {
    title: 'Organism/MarketLoanWidget',
    component: MarketLoanWidget,
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
    args: {
        markets: [...filMarkets, ...btcMarkets],
    },
} as Meta<typeof MarketLoanWidget>;

const Template: StoryFn<typeof MarketLoanWidget> = args => (
    <MarketLoanWidget {...args} />
);

export const Default = Template.bind({});
export const ItayoseMarket = Template.bind({});
ItayoseMarket.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'DEC22' }).click();
    canvas.getByRole('menuitem', { name: 'JUN23' }).click();
};
