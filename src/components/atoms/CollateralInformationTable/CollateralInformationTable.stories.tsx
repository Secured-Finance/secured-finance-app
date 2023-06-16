import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { CollateralInformationTable } from './CollateralInformationTable';

export default {
    title: 'Atoms/CollateralInformationTable',
    component: CollateralInformationTable,
    args: {
        data: [
            { asset: CurrencySymbol.ETH, quantity: 1.2 },
            { asset: CurrencySymbol.USDC, quantity: 100 },
        ],
        assetTitle: 'Asset',
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof CollateralInformationTable>;

const Template: ComponentStory<typeof CollateralInformationTable> = args => {
    return <CollateralInformationTable {...args} />;
};

export const Default = Template.bind({});
