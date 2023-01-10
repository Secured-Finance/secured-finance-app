import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'bignumber.js';
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
            ccyName: 'ETH',
            collateral: new BigNumber('10000000000000000000'),
            usdCollateral: new BigNumber('100000000000000000000'),
            coverage: new BigNumber('80'),
        },
        loanValue: LoanValue.fromApy(new Rate(10000), dec22Fixture.toNumber()), // 1%
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
    },
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
