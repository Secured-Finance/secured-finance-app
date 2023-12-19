import type { Meta, StoryFn } from '@storybook/react';
import { assetPriceMap, dailyVolumes } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { CurveHeader } from './CurveHeader';

export default {
    title: 'Molecules/CurveHeader',
    component: CurveHeader,
    args: {
        asset: CurrencySymbol.WFIL,
        dailyVolumes: dailyVolumes.slice(0, 10),
        priceList: assetPriceMap,
    },
    argTypes: {},
} as Meta<typeof CurveHeader>;

const Template: StoryFn<typeof CurveHeader> = args => {
    return <CurveHeader {...args} />;
};

export const Default = Template.bind({});
