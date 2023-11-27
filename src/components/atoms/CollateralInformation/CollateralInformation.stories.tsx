import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CollateralInformation } from './CollateralInformation';

export default {
    title: 'Atoms/CollateralInformation',
    component: CollateralInformation,
    args: {
        asset: CurrencySymbol.ETH,
        quantity: 1.2,
    },
} as Meta<typeof CollateralInformation>;

const Template: StoryFn<typeof CollateralInformation> = args => {
    return <CollateralInformation {...args} />;
};

export const Default = Template.bind({});
