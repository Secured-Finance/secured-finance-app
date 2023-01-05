import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { dec22Fixture, maturityOptions } from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { LendingCard } from './LendingCard';

export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {
        collateralBook: {
            collateral: {
                ETH: BigNumber.from('1000000000000000000'),
                USDC: BigNumber.from('10000000'),
            },
            usdCollateral: 100,
            coverage: BigNumber.from('80'),
        },
        marketValue: LoanValue.fromApy(
            new Rate(10000),
            dec22Fixture.toNumber()
        ),
        maturitiesOptionList: maturityOptions,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof LendingCard>;

const Template: ComponentStory<typeof LendingCard> = args => {
    return <LendingCard {...args} />;
};

export const Default = Template.bind({});
