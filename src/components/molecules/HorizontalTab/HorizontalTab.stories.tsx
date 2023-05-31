import { ComponentMeta, ComponentStory } from '@storybook/react';
import { HorizontalTab } from './HorizontalTab';

export default {
    title: 'Molecules/HorizontalTab',
    component: HorizontalTab,
    args: {
        tabTitles: ['Active Contracts', 'Trade History'],
    },
} as ComponentMeta<typeof HorizontalTab>;

const Template: ComponentStory<typeof HorizontalTab> = args => (
    <div className='h-[400px] w-[600px] text-white-80'>
        <HorizontalTab {...args}>
            <div>This is a Great Tab Content</div>
            <div className='py-12'>This is the content of the second tab</div>
        </HorizontalTab>
    </div>
);

export const Default = Template.bind({});
export const WithStyling = Template.bind({});
WithStyling.args = {
    tabTitles: ['Test'],
};
