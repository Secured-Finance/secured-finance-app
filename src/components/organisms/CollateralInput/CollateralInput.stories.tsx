import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CollateralInput } from './CollateralInput';

export default {
    title: 'Organism/CollateralInput',
    component: CollateralInput,
    args: {
        price: 100,
        availableAmount: 10,
        asset: CurrencySymbol.ETH,
    },
} as ComponentMeta<typeof CollateralInput>;

const Template: ComponentStory<typeof CollateralInput> = args => (
    <CollateralInput {...args} />
);

export const Default = Template.bind({});
