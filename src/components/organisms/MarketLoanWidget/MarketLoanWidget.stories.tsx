import { ComponentMeta, ComponentStory } from '@storybook/react';
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
      }))
    : [];

export default {
    title: 'Organism/MarketLoanWidget',
    component: MarketLoanWidget,
    args: {
        loans: [...filMarkets, ...btcMarkets],
    },
} as ComponentMeta<typeof MarketLoanWidget>;

const Template: ComponentStory<typeof MarketLoanWidget> = args => (
    <MarketLoanWidget {...args} />
);

export const Default = Template.bind({});
