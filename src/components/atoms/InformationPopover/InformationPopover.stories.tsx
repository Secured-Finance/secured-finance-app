import { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { InformationPopover } from './InformationPopover';

export default {
    title: 'Atoms/InformationPopover',
    component: InformationPopover,
} as ComponentMeta<typeof InformationPopover>;

const Template: ComponentStory<typeof InformationPopover> = () => (
    <div className='mx-40 w-fit'>
        <InformationPopover>
            You are currently at 43% to liquidation.
        </InformationPopover>
    </div>
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('information-circle');
    await userEvent.hover(button);
};
