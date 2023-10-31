import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { Rate } from 'src/utils';
import { MultiCurveChart } from './MultiCurveChart';

export default {
    title: 'Organism/MultiCurveChart',
    component: MultiCurveChart,
    args: {
        title: 'Yield Curve Title',
        curves: {
            WFIL: [
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
            ETH: [
                new Rate(9486),
                new Rate(8484),
                new Rate(7478),
                new Rate(6473),
                new Rate(4452),
                new Rate(9442),
                new Rate(9426),
                new Rate(9416),
            ],
            USDC: [
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
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof MultiCurveChart>;

const Template: StoryFn<typeof MultiCurveChart> = args => (
    <MultiCurveChart {...args} />
);

export const Default = Template.bind({});

export const NonOverLapping = Template.bind({});
NonOverLapping.args = {
    curves: {
        WFIL: [
            new Rate(9486),
            new Rate(8484),
            new Rate(7478),
            new Rate(6473),
            new Rate(9452),
            new Rate(9442),
            new Rate(9426),
            new Rate(9416),
        ],
        WBTC: [
            new Rate(19386),
            new Rate(19384),
            new Rate(19378),
            new Rate(14973),
            new Rate(19352),
            new Rate(16942),
            new Rate(19326),
            new Rate(12316),
        ],
        ETH: [
            new Rate(9486),
            new Rate(1484),
            new Rate(5478),
            new Rate(2473),
            new Rate(9452),
            new Rate(3442),
            new Rate(8426),
            new Rate(5416),
        ],
        USDC: [
            new Rate(11386),
            new Rate(12384),
            new Rate(19378),
            new Rate(14373),
            new Rate(15352),
            new Rate(16342),
            new Rate(19926),
            new Rate(18316),
        ],
    },
};
