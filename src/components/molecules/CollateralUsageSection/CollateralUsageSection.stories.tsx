import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { collateralBook80 } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { CollateralUsageSection } from '.';

export default {
    title: 'Molecules/CollateralUsageSection',
    component: CollateralUsageSection,
    args: {
        usdCollateral: collateralBook80.usdCollateral,
        collateralCoverage: collateralBook80.coverage.toNumber(),
        currency: CurrencySymbol.EFIL,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof CollateralUsageSection>;

const Template: ComponentStory<typeof CollateralUsageSection> = args => (
    <CollateralUsageSection {...args} />
);

export const Default = Template.bind({});
