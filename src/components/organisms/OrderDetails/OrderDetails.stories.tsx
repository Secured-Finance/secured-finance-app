import {
    withAssetPrice,
    withMaturities,
    withWalletProvider,
} from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
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
    },
    decorators: [withAssetPrice, withWalletProvider, withMaturities],
} as Meta<typeof OrderDetails>;

const Template: StoryFn<typeof OrderDetails> = args => (
    <OrderDetails {...args} />
);

export const Default = Template.bind({});
