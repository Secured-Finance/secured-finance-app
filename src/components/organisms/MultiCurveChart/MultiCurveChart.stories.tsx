import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Rate } from 'src/utils';
import { MultiCurveChart } from './MultiCurveChart';

export default {
    title: 'Organism/MultiCurveChart',
    component: MultiCurveChart,
    args: {
        title: 'Yield Curve Title',
        curves: {
            EFIL: [
                new Rate(9486),
                new Rate(8484),
                new Rate(7478),
                new Rate(6473),
                new Rate(4452),
                new Rate(9442),
                new Rate(9426),
                new Rate(9416),
            ],
            WBTC: [
                new Rate(11386),
                new Rate(12384),
                new Rate(13378),
                new Rate(14373),
                new Rate(15352),
                new Rate(16342),
                new Rate(17326),
                new Rate(18316),
            ],
        },
        labels: [
            'label1',
            'label2',
            'label3',
            'label4',
            'label5',
            'label6',
            'label7',
            'label8',
        ],
    },
} as ComponentMeta<typeof MultiCurveChart>;

const Template: ComponentStory<typeof MultiCurveChart> = args => (
    <MultiCurveChart {...args} />
);

export const Default = Template.bind({});
