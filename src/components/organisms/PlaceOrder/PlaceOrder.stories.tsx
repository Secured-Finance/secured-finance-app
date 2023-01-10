import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { LoanValue } from 'src/utils/entities';
import { PlaceOrder } from './PlaceOrder';

export default {
    title: 'Organism/PlaceOrder',
    component: PlaceOrder,
    args: {
        isOpen: true,
        onClose: () => {},
        loanValue: LoanValue.fromPrice(9410, dec22Fixture.toNumber()),
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
