import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
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
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
    decorators: [withWalletProvider],
} as Meta<typeof SimpleAdvancedView>;

const Template: StoryFn<typeof SimpleAdvancedView> = args => (
    <SimpleAdvancedView {...args} />
);

export const Default = Template.bind({});
export const Advanced = Template.bind({});
Advanced.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('Advanced').click();
};
