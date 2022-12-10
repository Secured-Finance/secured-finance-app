import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'bignumber.js';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { LendingCard } from './LendingCard';

export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {
        collateralBook: {
            ccyName: 'ETH',
            collateral: new BigNumber('10000000000000000000'),
            usdCollateral: new BigNumber('100000000000000000000'),
            coverage: new BigNumber('80'),
        },
        marketRate: new Rate(10000), // 1%
        maturitiesOptionList: maturityOptions,
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof LendingCard>;

const Template: ComponentStory<typeof LendingCard> = args => {
    return <LendingCard {...args} />;
};

export const Default = Template.bind({});
