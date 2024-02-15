import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { currencyList } from 'src/stories/mocks/fixtures';
import { createCurrencyMap } from 'src/utils';
import { AssetSelector } from './AssetSelector';

const priceList = createCurrencyMap<number>(0);
priceList.WBTC = 20515;
priceList.ETH = 1012;
priceList.WFIL = 4.85;
priceList.USDC = 1.0;

export default {
    title: 'Molecules/AssetSelector',
    component: AssetSelector,
    args: {
        options: currencyList,
        selected: currencyList[0],
        priceList,
        onAssetChange: () => {},
        onAmountChange: () => {},
    },
} as Meta<typeof AssetSelector>;

const Template: StoryFn<typeof AssetSelector> = args => (
    <AssetSelector {...args} />
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button').click();
};
