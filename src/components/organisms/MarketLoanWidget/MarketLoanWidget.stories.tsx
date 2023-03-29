import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    btcBytes32,
    filBytes32,
    preloadedLendingMarkets,
} from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { MarketLoanWidget } from './MarketLoanWidget';

const filMarkets = preloadedLendingMarkets?.availableContracts?.lendingMarkets
    ? Object.values(
          preloadedLendingMarkets?.availableContracts?.lendingMarkets[
              CurrencySymbol.FIL
          ]
      ).map(m => ({
          ...m,
          currency: filBytes32,
      }))
    : [];
const btcMarkets = preloadedLendingMarkets?.availableContracts?.lendingMarkets
    ? Object.values(
          preloadedLendingMarkets?.availableContracts?.lendingMarkets[
              CurrencySymbol.BTC
          ]
      ).map(m => ({
          ...m,
          currency: btcBytes32,
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
export const ItayoseMarket = Template.bind({});
ItayoseMarket.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'DEC22' }).click();
    canvas.getByRole('menuitem', { name: 'JUN23' }).click();
};
