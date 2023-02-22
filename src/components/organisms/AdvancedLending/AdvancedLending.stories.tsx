import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAssetPrice,
    withFullPage,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    collateralBook80,
    dec22Fixture,
    maturityOptions,
    yieldCurveRates,
} from 'src/stories/mocks/fixtures';
import { mockTrades, mockUserHistory } from 'src/stories/mocks/queries';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { AdvancedLending } from './AdvancedLending';

export default {
    title: 'Organism/AdvancedLending',
    component: AdvancedLending,
    chromatic: { pauseAnimationAtEnd: true },
    args: {
        collateralBook: collateralBook80,
        loanValue: LoanValue.fromApy(new Rate(10000), dec22Fixture.toNumber()), // 1%
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
    },
    parameters: {
        apolloClient: {
            mocks: [...mockUserHistory, ...mockTrades],
        },
    },
    decorators: [withFullPage, withAssetPrice, withWalletProvider],
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

export const MyOrders = Template.bind({});
MyOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('My Orders').click();
};

export const MyOrdersConnectedToWallet = Template.bind({});
MyOrdersConnectedToWallet.parameters = {
    connected: true,
};
MyOrdersConnectedToWallet.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('My Orders').click();
};
