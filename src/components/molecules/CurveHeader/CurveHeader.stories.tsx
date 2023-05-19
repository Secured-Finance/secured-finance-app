import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { dailyVolumes } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { CurveHeader } from './CurveHeader';

export default {
    title: 'Molecules/CurveHeader',
    component: CurveHeader,
    args: {
        asset: CurrencySymbol.EFIL,
        dailyVolumes: dailyVolumes.slice(0, 10),
    },
    argTypes: {},
    decorators: [withAssetPrice],
} as ComponentMeta<typeof CurveHeader>;

const Template: ComponentStory<typeof CurveHeader> = args => {
    return <CurveHeader {...args} />;
};

export const Default = Template.bind({});
