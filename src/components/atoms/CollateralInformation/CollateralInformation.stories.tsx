import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { CollateralInformation } from './CollateralInformation';

export default {
    title: 'Atoms/CollateralInformation',
    component: CollateralInformation,
    args: {
        asset: CurrencySymbol.ETH,
        quantity: 1.2,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof CollateralInformation>;

const Template: ComponentStory<typeof CollateralInformation> = args => {
    return <CollateralInformation {...args} />;
};

export const Default = Template.bind({});
