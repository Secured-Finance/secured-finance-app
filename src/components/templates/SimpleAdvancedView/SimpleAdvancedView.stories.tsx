import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SimpleAdvancedView } from './SimpleAdvancedView';

export default {
    title: 'Templates/SimpleAdvancedView',
    component: SimpleAdvancedView,
    args: {
        title: 'SimpleAdvanceView',
        simpleComponent: (
            <div className='p-10 text-white'>Simple Component</div>
        ),
        advanceComponent: (
            <div className='p-10 text-white'>Advanced Component</div>
        ),
    },
} as ComponentMeta<typeof SimpleAdvancedView>;

const Template: ComponentStory<typeof SimpleAdvancedView> = args => (
    <SimpleAdvancedView {...args} />
);

export const Default = Template.bind({});
