import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useLandingOrderFormStore } from 'src/store/landingOrderForm';
import {
    collateralBook37,
    dec22Fixture,
    maturityOptions,
} from 'src/stories/mocks/fixtures';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { PlaceOrder } from './PlaceOrder';

export default {
    title: 'Organism/PlaceOrder',
    component: PlaceOrder,
    args: {
        isOpen: true,
        onClose: () => {},
        collateral: collateralBook37,
        loanValue: LoanValue.fromPrice(9410, dec22Fixture.toNumber()),
        orderAmount: new Amount('100000000', CurrencySymbol.USDC),
        maturity: dec22Fixture,
        orderType: OrderType.LIMIT,
        side: OrderSide.BORROW,
        assetPrice: 1,
        walletSource: WalletSource.METAMASK,
        maturitiesOptionList: maturityOptions,
    },
    chromatic: { delay: 1000 },
    decorators: [withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
        connected: true,
    },
} as Meta<typeof PlaceOrder>;

const Template: StoryFn<typeof PlaceOrder> = args => {
    useEffect(() => {
        const timerId = setTimeout(() => {
            useLandingOrderFormStore
                .getState()
                .setCurrency(CurrencySymbol.USDC);
            useLandingOrderFormStore.getState().setAmount('100000000');
        }, 200);

        return () => clearTimeout(timerId);
    }, []);

    return <PlaceOrder {...args} />;
};

export const Default = Template.bind({});

export const Delisted = Template.bind({});
Delisted.args = {
    isCurrencyDelisted: true,
};

export const UnderMinimumCollateralThreshold = Template.bind({});
UnderMinimumCollateralThreshold.args = {
    loanValue: LoanValue.fromPrice(8600, dec22Fixture.toNumber()),
    orderAmount: new Amount('800000000000000000000', CurrencySymbol.WFIL),
    assetPrice: 6,
};
