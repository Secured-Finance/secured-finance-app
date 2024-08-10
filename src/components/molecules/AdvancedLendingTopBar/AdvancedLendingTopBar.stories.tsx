import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { WithGraphClient, withWalletProvider } from '.storybook/decorators';
import type { Meta } from '@storybook/react';
import { StoryFn } from '@storybook/react';
import {
    currencyList,
    dailyMarketStats,
    maturityOptions,
} from 'src/stories/mocks/fixtures';
import { mockDailyVolumes, mockTrades } from 'src/stories/mocks/queries';
import { LoanValue } from 'src/utils/entities';
import { AdvancedLendingTopBar } from '.';

const lastTradePrice = 8000;

export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
    decorators: [withWalletProvider, WithGraphClient],
    args: {
        selectedAsset: currencyList[3],
        assetList: currencyList,
        options: maturityOptions,
        selected: {
            label: maturityOptions[0].label,
            value: maturityOptions[0].value,
        },
        onAssetChange: () => {},
        onTermChange: () => {},
        currentMarket: {
            value: LoanValue.fromPrice(
                lastTradePrice,
                maturityOptions[0].value.toNumber()
            ),
            time: 1646920200,
            type: 'block',
        },
        currencyPrice: '$1.00',
        marketInfo: dailyMarketStats,
    },
    parameters: {
        apolloClient: {
            mocks: [...mockTrades, ...mockDailyVolumes],
        },
        ...RESPONSIVE_PARAMETERS,
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof AdvancedLendingTopBar>;

const Template: StoryFn<typeof AdvancedLendingTopBar> = args => (
    <AdvancedLendingTopBar {...args} />
);

export const Default = Template.bind({});
