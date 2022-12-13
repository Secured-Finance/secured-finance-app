import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'bignumber.js';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { fixture_dec22, maturityOptions } from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
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
        marketValue: LoanValue.fromApy(
            new Rate(10000),
            fixture_dec22.toNumber()
        ),
        maturitiesOptionList: maturityOptions,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof LendingCard>;

const Template: ComponentStory<typeof LendingCard> = args => {
    return <LendingCard {...args} />;
};

export const Default = Template.bind({});
