import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { HorizontalTab } from './HorizontalTab';

export default {
    title: 'Molecules/HorizontalTab',
    component: HorizontalTab,
    args: {
        tabTitles: ['Active Contracts', 'Trade History'],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof HorizontalTab>;

const Template: StoryFn<typeof HorizontalTab> = args => (
    <div className='w-full text-white-80'>
        <HorizontalTab {...args}>
            <div>This is a Great Tab Content</div>
            <div className='py-12'>This is the content of the second tab</div>
        </HorizontalTab>
    </div>
);

export const Default = Template.bind({});

export const MobileViewport = Template.bind({});

MobileViewport.parameters = {
    viewport: {
        defaultViewport: 'mobile',
    },
};
