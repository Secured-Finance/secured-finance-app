import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    dec22Fixture,
    maturityOptions,
    yieldCurveRates,
} from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { AdvancedLending } from './AdvancedLending';

export default {
    title: 'Organism/AdvancedLending',
    component: AdvancedLending,
    chromatic: { pauseAnimationAtEnd: true },
    args: {
        collateralBook: {
            collateral: {
                ETH: BigNumber.from('1000000000000000000'),
                USDC: BigNumber.from('10000000'),
            },
            usdCollateral: 100,
            coverage: BigNumber.from('80'),
        },
        loanValue: LoanValue.fromApy(new Rate(10000), dec22Fixture.toNumber()), // 1%
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
    },
    parameters: { date: { tick: true } },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof AdvancedLending>;

const Template: ComponentStory<typeof AdvancedLending> = args => {
    return (
        <div className='p-20'>
            <AdvancedLending {...args} />
        </div>
    );
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
