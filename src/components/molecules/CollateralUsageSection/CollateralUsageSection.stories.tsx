import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { CollateralUsageSection } from '.';

export default {
    title: 'Molecules/CollateralUsageSection',
    component: CollateralUsageSection,
    args: {
        usdCollateral: collateralBook37.usdCollateral,
        collateralCoverage: collateralBook37.coverage.toNumber(),
        currency: CurrencySymbol.EFIL,
        collateralThreshold: 80,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof CollateralUsageSection>;

const Template: ComponentStory<typeof CollateralUsageSection> = args => (
    <CollateralUsageSection {...args} />
);

export const Default = Template.bind({});
