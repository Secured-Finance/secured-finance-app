import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { OrderType } from 'src/hooks';
import { collateralBook37, dec22Fixture } from 'src/stories/mocks/fixtures';
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
        orderAmount: new Amount('1000000000', CurrencySymbol.USDC),
        maturity: dec22Fixture,
        orderType: OrderType.LIMIT,
        side: OrderSide.BORROW,
        assetPrice: 6.12,
        walletSource: WalletSource.METAMASK,
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof PlaceOrder>;

const Template: ComponentStory<typeof PlaceOrder> = args => {
    return <PlaceOrder {...args} />;
};

export const Default = Template.bind({});
export const MarketOrder = Template.bind({});
MarketOrder.args = {
    loanValue: undefined,
};
