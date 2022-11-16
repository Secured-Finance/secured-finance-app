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
            usdCollateral: new BigNumber('1000000000000000000000'),
            coverage: new BigNumber('800'),
        },
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof MarketDashboardOrderCard>;

const Template: ComponentStory<typeof MarketDashboardOrderCard> = args => {
    return <MarketDashboardOrderCard {...args} />;
};

export const Default = Template.bind({});
