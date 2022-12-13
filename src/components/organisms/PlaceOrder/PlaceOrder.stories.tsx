import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { fixture_dec22 } from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { PlaceOrder } from './PlaceOrder';

export default {
    title: 'Organism/PlaceOrder',
    component: PlaceOrder,
    args: {
        isOpen: true,
        onClose: () => {},
        value: LoanValue.fromApy(new Rate(10000), fixture_dec22.toNumber()),
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof PlaceOrder>;

const Template: ComponentStory<typeof PlaceOrder> = args => {
    return <PlaceOrder {...args} />;
};

export const Default = Template.bind({});
