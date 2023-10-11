import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { assetList } from 'src/stories/mocks/fixtures';
import { AssetSelector } from './AssetSelector';

type AllowedCcy = 'WBTC' | 'ETH' | 'WFIL' | 'USDC' | 'USDT';
const Chip = (
    <div className='rounded-xl bg-black-40 px-4 py-1 text-orange'>Chip</div>
);

const priceList: Record<AllowedCcy, number> = {
    WBTC: 20515,
    ETH: 1012,
    WFIL: 4.85,
    USDC: 1.0,
    USDT: 0.99,
};

export default {
    title: 'Molecules/AssetSelector',
    component: AssetSelector<AllowedCcy>,
    args: {
        options: assetList.map(a => ({
            ...a,
            chip: Chip,
        })),
        selected: assetList[0],
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
