import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import {
    mockDailyVolumes,
    mockFilteredUserOrderHistory,
    mockFilteredUserTransactionHistory,
    mockTrades,
} from 'src/stories/mocks/queries';
import { AdvancedLendingTopBar } from '.';

export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
    args: {
        selectedAsset: currencyList[2],
        assetList: currencyList,
        options: maturityOptions,
        selected: {
            label: maturityOptions[0].label,
            value: maturityOptions[0].value,
        },
        onAssetChange: () => {},
        onTermChange: () => {},
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        apolloClient: {
            mocks: [
                ...mockTrades,
                ...mockFilteredUserTransactionHistory,
                ...mockFilteredUserOrderHistory,
                ...mockDailyVolumes,
            ],
        },
        layout: 'fullscreen',
    },
} as Meta<typeof AdvancedLendingTopBar>;

const Template: StoryFn<typeof AdvancedLendingTopBar> = args => (
    <AdvancedLendingTopBar {...args} />
);

export const Default = Template.bind({});

export const Values = Template.bind({});
Values.args = {
    values: ['26.16', '24.2', '894', '10,000,000'],
    currencyPrice: '23000',
};
