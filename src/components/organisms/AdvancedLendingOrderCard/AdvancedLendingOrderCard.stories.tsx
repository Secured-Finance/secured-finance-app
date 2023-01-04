import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { AdvancedLendingOrderCard } from './AdvancedLendingOrderCard';

export default {
    title: 'Organism/AdvancedLendingOrderCard',
    component: AdvancedLendingOrderCard,
    args: {
        collateralBook: {
            ccyName: 'ETH',
            collateral: BigNumber.from('10000000000000000000'),
            usdCollateral: 1000,
            coverage: BigNumber.from('800'),
        },
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof AdvancedLendingOrderCard>;

const Template: ComponentStory<typeof AdvancedLendingOrderCard> = args => {
    return <AdvancedLendingOrderCard {...args} />;
};

export const Default = Template.bind({});
