import type { Meta, StoryFn } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { CollateralUsageSection } from '.';

export default {
    title: 'Molecules/CollateralUsageSection',
    component: CollateralUsageSection,
    args: {
        usdCollateral: collateralBook37.usdCollateral,
        collateralCoverage: Number(collateralBook37.coverage),
        currency: CurrencySymbol.WFIL,
        collateralThreshold: 80,
    },
    decorators: [withAssetPrice],
} as Meta<typeof CollateralUsageSection>;

const Template: StoryFn<typeof CollateralUsageSection> = args => (
    <CollateralUsageSection {...args} />
);

export const Default = Template.bind({});
