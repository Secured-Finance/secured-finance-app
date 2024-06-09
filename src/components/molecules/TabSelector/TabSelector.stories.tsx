import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { TabSelector } from './TabSelector';

export default {
    title: 'Molecules/TabSelector',
    component: TabSelector,
    args: {
        tabDataArray: [
            { text: 'Tab A' },
            { text: 'Tab B' },
            { text: 'Tab C', disabled: true },
        ],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof TabSelector>;

const Template: StoryFn<typeof TabSelector> = args => (
    <div className='h-[400px] w-[600px] text-white-80'>
        <TabSelector {...args}>
            <div className='p-4'>Tab A Content</div>
            <div className='p-4'>Tab B Content</div>
            <div className='p-4'>Tab C Content</div>
        </TabSelector>
    </div>
);

export const Default = Template.bind({});
export const WithUtils = Template.bind({});
WithUtils.args = {
    tabDataArray: [
        {
            text: 'Tab A',
            util: (
                <div
                    key={1}
                    className='flex h-full flex-row items-center justify-end gap-2'
                >
                    <p>Util A</p>
                    <p>Util A</p>
                </div>
            ),
        },
        {
            text: 'Tab B',
            util: (
                <div
                    className='flex h-full flex-row items-center justify-start'
                    key={3}
                >
                    Util B
                </div>
            ),
        },
        { text: 'Tab C', disabled: true },
    ],
};

export const WithTabGroupStyles = Template.bind({});
WithTabGroupStyles.args = {
    tabGroupClassName: 'laptop:max-w-[300px]',
};
