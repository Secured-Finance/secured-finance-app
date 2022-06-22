import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurveFilter } from './CurveFilter';

export default {
    title: 'Organism/CurveFilter',
    component: CurveFilter,
    args: {},
    argTypes: {},
} as ComponentMeta<typeof CurveFilter>;

const Template: ComponentStory<typeof CurveFilter> = args => (
    <CurveFilter {...args} />
);

export const Default = Template.bind({});
