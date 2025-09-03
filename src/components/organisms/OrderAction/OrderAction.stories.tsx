import { withBalance, withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { emptyCollateralBook } from 'src/hooks';
import { useLandingOrderFormStore } from 'src/store/landingOrderForm';
import {
    collateralBook37,
    collateralBook80,
    dec22Fixture,
} from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { OrderAction } from '.';

export default {
    title: 'Organism/OrderAction',
    component: OrderAction,
    args: {
        collateralBook: emptyCollateralBook,
        loanValue: LoanValue.fromPrice(9800, dec22Fixture.toNumber()),
        validation: false,
        isCurrencyDelisted: false,
    },
    decorators: [withBalance, withWalletProvider],
    argTypes: {
        collateralBook: {
            options: [
                'collateralBook37',
                'collateralBook80',
                'emptyCollateralBook',
            ],
            mapping: {
                collateralBook37: collateralBook37,
                collateralBook80: collateralBook80,
                emptyCollateralBook: emptyCollateralBook,
            },
        },
    },
} as Meta<typeof OrderAction>;

const Template: StoryFn<typeof OrderAction> = args => {
    useEffect(() => {
        const timerId = setTimeout(() => {
            useLandingOrderFormStore
                .getState()
                .setCurrency(CurrencySymbol.USDC);
            useLandingOrderFormStore.getState().setAmount('500000000');
            useLandingOrderFormStore.getState().setSide(OrderSide.BORROW);
            useLandingOrderFormStore
                .getState()
                .setMaturity(dec22Fixture.toNumber());
        }, 200);

        return () => clearTimeout(timerId);
    }, []);
    return <OrderAction {...args} />;
};

const NotEnoughCollateralTemplate: StoryFn<typeof OrderAction> = args => {
    useEffect(() => {
        const timerId = setTimeout(() => {
            useLandingOrderFormStore
                .getState()
                .setCurrency(CurrencySymbol.USDC);
            useLandingOrderFormStore.getState().setAmount('6000000000');
            useLandingOrderFormStore.getState().setSide(OrderSide.BORROW);
            useLandingOrderFormStore
                .getState()
                .setMaturity(dec22Fixture.toNumber());
        }, 200);

        return () => clearTimeout(timerId);
    }, []);
    return <OrderAction {...args} />;
};

export const Primary = Template.bind({});
export const EnoughCollateral = Template.bind({});
EnoughCollateral.parameters = {
    connected: true,
};
EnoughCollateral.args = {
    collateralBook: collateralBook37,
    canPlaceOrder: true,
};

export const NotEnoughCollateral = NotEnoughCollateralTemplate.bind({});
NotEnoughCollateral.args = {
    collateralBook: collateralBook37,
    canPlaceOrder: false,
};
NotEnoughCollateral.parameters = {
    connected: true,
};

export const RenderOrderSideButton = Template.bind({});
RenderOrderSideButton.args = {
    collateralBook: collateralBook37,
    canPlaceOrder: true,
    renderSide: true,
};
RenderOrderSideButton.parameters = {
    connected: true,
};
