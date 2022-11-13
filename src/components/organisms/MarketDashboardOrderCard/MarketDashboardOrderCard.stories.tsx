import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'bignumber.js';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { MarketDashboardOrderCard } from './MarketDashboardOrderCard';

export default {
    title: 'Organism/MarketDashboardOrderCard',
    component: MarketDashboardOrderCard,
    args: {
        onPlaceOrder: async () => {
            return Promise.resolve();
        },
        collateralBook: {
            ccyName: 'ETH',
            collateral: new BigNumber('10000000000000000000'),
            usdCollateral: new BigNumber('100000000000000000000'),
            coverage: new BigNumber('80'),
        },
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof MarketDashboardOrderCard>;

const Template: ComponentStory<typeof MarketDashboardOrderCard> = args => {
    return <MarketDashboardOrderCard {...args} />;
};

export const Default = Template.bind({});

export const WithError = Template.bind({});
WithError.args = {
    onPlaceOrder: async () => {
        throw Error('Something went wrong');
    },
};
export const PendingTransaction = Template.bind({});
PendingTransaction.args = {
    onPlaceOrder: async () => {
        return new Promise(resolve => {
            setTimeout(resolve, 5000);
        });
    },
};
