import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { CurveHeader } from './CurveHeader';

export default {
    title: 'Molecules/CurveHeader',
    component: CurveHeader,
    args: {
        asset: CurrencySymbol.FIL,
        isBorrow: true,
    },
    argTypes: {},
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof CurveHeader>;

const Template: ComponentStory<typeof CurveHeader> = args => {
    return <CurveHeader {...args} />;
};

export const Default = Template.bind({});
