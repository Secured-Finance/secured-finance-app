import { OrderSide } from '@secured-finance/sf-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { setAmount, setCurrency } from 'src/store/landingOrderForm';
import {
    collateralBook37,
    collateralBook80,
    emptyCollateralBook,
} from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { OrderAction } from '.';

export default {
    title: 'Organism/OrderAction',
    component: OrderAction,
    args: {
        availableToBorrow: 0,
        collateralBook: emptyCollateralBook,
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof OrderAction>;

const Template: ComponentStory<typeof OrderAction> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.USDC));
            dispatch(setAmount(BigNumber.from(500000000)));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);
    return <OrderAction {...args} />;
};

export const Primary = Template.bind({});
export const EnoughCollateral = Template.bind({});
EnoughCollateral.args = {
    collateralBook: collateralBook37,
};
EnoughCollateral.parameters = {
    connected: true,
};

export const NotEnoughCollateral = Template.bind({});
NotEnoughCollateral.args = {
    collateralBook: collateralBook80,
};
NotEnoughCollateral.parameters = {
    connected: true,
};

export const OrderSideButton = Template.bind({});
OrderSideButton.args = {
    collateralBook: collateralBook37,
    orderSide: OrderSide.BORROW,
};
OrderSideButton.parameters = {
    connected: true,
};
