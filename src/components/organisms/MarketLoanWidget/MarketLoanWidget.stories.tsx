import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import {
    preloadedLendingMarkets,
    wbtcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { MarketLoanWidget } from './MarketLoanWidget';

const filMarkets = preloadedLendingMarkets?.availableContracts?.lendingMarkets
    ? Object.values(
          preloadedLendingMarkets?.availableContracts?.lendingMarkets[
              CurrencySymbol.WFIL
          ]
      ).map(m => ({
          ...m,
          currency: wfilBytes32,
          ccy: CurrencySymbol.WFIL,
      }))
    : [];
const btcMarkets = preloadedLendingMarkets?.availableContracts?.lendingMarkets
    ? Object.values(
          preloadedLendingMarkets?.availableContracts?.lendingMarkets[
              CurrencySymbol.WBTC
          ]
      ).map(m => ({
          ...m,
          currency: wbtcBytes32,
          ccy: CurrencySymbol.WBTC,
      }))
    : [];

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
    const dec22Button = await canvas.findByRole('button', { name: 'DEC22' });
    await userEvent.click(dec22Button);
    const menuItem = await canvas.findByRole('menuitem', { name: 'JUN23' });
    await userEvent.click(menuItem);
};
