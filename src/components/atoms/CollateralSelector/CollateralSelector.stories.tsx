import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CollateralSelector } from './CollateralSelector';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

const assetList = [
    {
        symbol: CurrencySymbol.USDC,
        availableFullValue: BigInt('1000000000'),
        available: FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD,
        name: 'USDC',
    },
    {
        symbol: CurrencySymbol.ETH,
        availableFullValue: BigInt('120000000000000000000'),
        available: 120,
        name: 'Ethereum',
    },
];

export default {
    title: 'Atoms/CollateralSelector',
    component: CollateralSelector,
    args: {
        headerText: 'Select Asset',
        optionList: assetList,
        onChange: () => {},
    },
} as Meta<typeof CollateralSelector>;

const Template: StoryFn<typeof CollateralSelector> = args => (
    <div className='h-20 w-[360px]'>
        <CollateralSelector {...args} />
    </div>
);

export const Default = Template.bind({});
