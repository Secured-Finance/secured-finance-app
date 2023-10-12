import { withAssetPrice, withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { collateralBook37, dec22Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { OrderDetails } from './OrderDetails';

export default {
    title: 'Organism/OrderDetails',
    component: OrderDetails,
    args: {
        amount: new Amount('100000000', CurrencySymbol.USDC),
        maturity: dec22Fixture,
        side: OrderSide.BORROW,
        assetPrice: 1,
        collateral: collateralBook37,
        loanValue: LoanValue.fromPrice(9410, dec22Fixture.toNumber()),
        isCurrencyDelisted: false,
    },
    chromatic: { delay: 1000 },
    decorators: [withAssetPrice, withWalletProvider],
    parameters: {
        connected: true,
    },
} as Meta<typeof OrderDetails>;

const Template: StoryFn<typeof OrderDetails> = args => (
    <OrderDetails {...args} />
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('disclaimer-button');
    await userEvent.click(button);
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
