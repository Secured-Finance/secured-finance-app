import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { mockDailyVolumes } from 'src/stories/mocks/queries';
import { CurrencySymbol } from 'src/utils';
import { CurveHeader } from './CurveHeader';

export default {
    title: 'Molecules/CurveHeader',
    component: CurveHeader,
    args: {
        asset: CurrencySymbol.EFIL,
        isBorrow: true,
    },
    parameters: {
        apolloClient: {
            mocks: [...mockDailyVolumes],
        },
    },
    argTypes: {},
    decorators: [withAssetPrice],
} as ComponentMeta<typeof CurveHeader>;

const Template: ComponentStory<typeof CurveHeader> = args => {
    return <CurveHeader {...args} />;
};

export const Default = Template.bind({});
