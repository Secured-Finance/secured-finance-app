import type { Meta, StoryFn } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { dailyVolumes } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { CurveHeader } from './CurveHeader';

export default {
    title: 'Molecules/CurveHeader',
    component: CurveHeader,
    args: {
        asset: CurrencySymbol.WFIL,
        dailyVolumes: dailyVolumes.slice(0, 10),
    },
    argTypes: {},
    decorators: [withAssetPrice],
} as Meta<typeof CurveHeader>;

const Template: StoryFn<typeof CurveHeader> = args => {
    return <CurveHeader {...args} />;
};

export const Default = Template.bind({});
