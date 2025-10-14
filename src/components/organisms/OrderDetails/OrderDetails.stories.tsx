import { withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAmount, setCurrency } from 'src/store/landingOrderForm';
import { collateralBook37, dec22Fixture } from 'src/stories/mocks/fixtures';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { OrderDetails } from './OrderDetails';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Organism/OrderDetails',
    component: OrderDetails,
    args: {
        amount: new Amount('100000000', CurrencySymbol.USDC),
        maturity: dec22Fixture,
        side: OrderSide.BORROW,
        assetPrice: 1,
        collateral: collateralBook37,
        loanValue: LoanValue.fromPrice(9610, dec22Fixture.toNumber()),
        isCurrencyDelisted: false,
    },
    chromatic: { delay: FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD },
    decorators: [withWalletProvider],
    parameters: {
        connected: true,
    },
} as Meta<typeof OrderDetails>;

const Template: StoryFn<typeof OrderDetails> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.USDC));
            dispatch(setAmount('100000000'));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);

    return <OrderDetails {...args} />;
};

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('disclaimer-button');
    await userEvent.click(button);
};

export const MarketOrder = Template.bind({});
MarketOrder.args = {
    orderType: OrderType.MARKET,
};

export const LendPosition = Template.bind({});
LendPosition.args = {
    side: OrderSide.LEND,
};
LendPosition.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('disclaimer-button');
    await userEvent.click(button);
};

export const Delisted = Template.bind({});
Delisted.args = {
    isCurrencyDelisted: true,
};
Delisted.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('disclaimer-button');
    await userEvent.click(button);
};

export const UnderMinimumCollateralThreshold = Template.bind({});
UnderMinimumCollateralThreshold.args = {
    showWarning: true,
};

export const RemoveOrder = Template.bind({});
RemoveOrder.args = {
    isRemoveOrder: true,
};
