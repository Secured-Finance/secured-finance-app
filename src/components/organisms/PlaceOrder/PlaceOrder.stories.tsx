import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { Rate } from 'src/utils';
import { PlaceOrder } from './PlaceOrder';

export default {
    title: 'Organism/PlaceOrder',
    component: PlaceOrder,
    args: {
        isOpen: true,
        onClose: () => {},
        marketRate: new Rate(10000),
    },
    decorators: [WithAssetPrice, WithWalletProvider],
} as ComponentMeta<typeof PlaceOrder>;

const Template: ComponentStory<typeof PlaceOrder> = args => {
    return <PlaceOrder {...args} />;
};

export const Default = Template.bind({});
