import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    efilBytes32,
    preloadedLendingMarkets,
    wbtcBytes32,
} from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { MarketLoanWidget } from './MarketLoanWidget';

const filMarkets = preloadedLendingMarkets?.availableContracts?.lendingMarkets
    ? Object.values(
          preloadedLendingMarkets?.availableContracts?.lendingMarkets[
              CurrencySymbol.EFIL
          ]
      ).map(m => ({
          ...m,
          currency: efilBytes32,
          ccy: CurrencySymbol.EFIL,
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
        loans: [...filMarkets, ...btcMarkets],
    },
} as ComponentMeta<typeof MarketLoanWidget>;

const Template: ComponentStory<typeof MarketLoanWidget> = args => (
    <MarketLoanWidget {...args} />
);

export const Default = Template.bind({});
export const ItayoseMarket = Template.bind({});
ItayoseMarket.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'DEC22' }).click();
    canvas.getByRole('menuitem', { name: 'JUN23' }).click();
};
