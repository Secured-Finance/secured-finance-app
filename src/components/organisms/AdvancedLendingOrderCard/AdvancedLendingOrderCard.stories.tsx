import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'bignumber.js';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { AdvancedLendingOrderCard } from './AdvancedLendingOrderCard';

export default {
    title: 'Organism/AdvancedLendingOrderCard',
    component: AdvancedLendingOrderCard,
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
} as ComponentMeta<typeof AdvancedLendingOrderCard>;

const Template: ComponentStory<typeof AdvancedLendingOrderCard> = args => {
    return <AdvancedLendingOrderCard {...args} />;
};

export const Default = Template.bind({});
