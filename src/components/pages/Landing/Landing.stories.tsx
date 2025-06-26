import type { Meta, StoryFn } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { dec22Fixture, maturities } from 'src/stories/mocks/fixtures';
import {
    mockDailyVolumes,
    mockFilteredUserOrderHistory,
    mockFilteredUserTransactionHistory,
    mockRecentTrades,
    mockTrades,
    mockTransactionCandleStick,
} from 'src/stories/mocks/queries';
import { CurrencySymbol } from 'src/utils';
import { Landing, WithBanner } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    decorators: [withAppLayout, withBalance, withWalletProvider],
    args: {
        view: 'Simple',
    },
    parameters: {
        apolloClient: {
            mocks: [
                ...mockTrades,
                ...mockRecentTrades,
                ...mockDailyVolumes,
                ...mockTransactionCandleStick,
                ...mockFilteredUserOrderHistory,
                ...mockFilteredUserTransactionHistory,
            ],
        },
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Landing>;

const Template: StoryFn<typeof Landing> = args => {
    return <Landing {...args} />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

export const AdvancedViewConnected = Template.bind({});
AdvancedViewConnected.parameters = {
    connected: true,
};
AdvancedViewConnected.args = {
    view: 'Advanced',
};

export const WithBannerExample = () => {
    const mockMarket = maturities[dec22Fixture.toNumber()];
    return (
        <WithBanner
            ccy={CurrencySymbol.aUSDC}
            market={mockMarket}
            delistedCurrencySet={new Set()}
            isItayose={false}
            maximumOpenOrderLimit={undefined}
            preOrderDays={undefined}
        >
            <div>Banner Child Example</div>
        </WithBanner>
    );
};
WithBannerExample.storyName = 'WithBanner';
