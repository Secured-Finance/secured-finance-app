import {
    withAssetPrice,
    withMaturities,
    withWalletBalances,
    withWalletProvider,
} from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    setAmount,
    setCurrency,
    setMaturity,
    setSide,
} from 'src/store/landingOrderForm';
import {
    collateralBook37,
    collateralBook80,
    dec22Fixture,
    emptyCollateralBook,
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
    },
    decorators: [
        withMaturities,
        withWalletBalances,
        withAssetPrice,
        withWalletProvider,
    ],
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
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.USDC));
            dispatch(setAmount(BigNumber.from(500000000)));
            dispatch(setSide(OrderSide.BORROW));
            dispatch(setMaturity(dec22Fixture.toNumber()));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);
    return <OrderAction {...args} />;
};

export const Primary = Template.bind({});
export const EnoughCollateral = Template.bind({});
EnoughCollateral.parameters = {
    connected: true,
};
EnoughCollateral.args = {
    collateralBook: collateralBook37,
};

export const NotEnoughCollateral = Template.bind({});
NotEnoughCollateral.args = {
    collateralBook: collateralBook80,
};
NotEnoughCollateral.parameters = {
    connected: true,
};

export const RenderOrderSideButton = Template.bind({});
RenderOrderSideButton.args = {
    collateralBook: collateralBook37,
    renderSide: true,
};
RenderOrderSideButton.parameters = {
    connected: true,
};
