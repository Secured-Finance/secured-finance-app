import type { Meta, StoryFn } from '@storybook/react';
import { GlobalItayoseMultiCurveChart } from './GlobalItayoseMultiCurveChart';

export default {
    title: 'Organism/GlobalItayoseMultiCurveChart',
    component: GlobalItayoseMultiCurveChart,
} as Meta<typeof GlobalItayoseMultiCurveChart>;

const Template: StoryFn<typeof GlobalItayoseMultiCurveChart> = () => (
    <GlobalItayoseMultiCurveChart />
);

export const Default = Template.bind({});
