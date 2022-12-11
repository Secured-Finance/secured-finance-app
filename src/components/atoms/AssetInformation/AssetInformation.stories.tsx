import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { AssetInformation } from '.';

export default {
    title: 'Atoms/AssetInformation',
    component: AssetInformation,
    args: {
        header: 'Collateral Assets',
        asset: CurrencySymbol.FIL,
        quantity: 740,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof AssetInformation>;

const Template: ComponentStory<typeof AssetInformation> = args => {
    return <AssetInformation {...args} />;
};

export const Default = Template.bind({});

export const CollateralUtil = Template.bind({});
CollateralUtil.args = {
    header: 'Borrowed Assets',
    asset: CurrencySymbol.USDC,
    quantity: 12000,
};
