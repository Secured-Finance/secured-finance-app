import {
    ChevronDoubleDownIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Tooltip } from './Tooltip';

const ButtonIcon = (
    <button
        className='flex items-center rounded-full bg-teal p-5'
        data-testid='button-icon'
    >
        <ChevronDoubleDownIcon className='h-6 w-6 text-white' />
    </button>
);

const InformationIcon = (
    <InformationCircleIcon
        className='h-4 w-4 cursor-pointer text-slateGray'
        data-testid='information-circle'
    />
);

const children = (
    <div className='text-white'>
        <p>This is tooltip content. This is tooltip content.</p>
    </div>
);

export default {
    title: 'Templates/Tooltip',
    component: Tooltip,
    args: {
        children: children,
        iconElement: InformationIcon,
    },
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = args => (
    <div className='mx-10 flex w-full justify-center'>
        <Tooltip {...args} />
    </div>
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('information-circle');
    await userEvent.hover(button);
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    iconElement: ButtonIcon,
};

WithIcon.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('button-icon');
    await userEvent.hover(button);
};

export const LeftAligned = Template.bind({});
LeftAligned.args = {
    align: 'left',
};
LeftAligned.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('information-circle');
    await userEvent.hover(button);
};

export const RightAligned = Template.bind({});
RightAligned.args = {
    align: 'right',
};
RightAligned.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('information-circle');
    await userEvent.hover(button);
};

export const SmallWidth = Template.bind({});
SmallWidth.args = {
    maxWidth: 'small',
};
SmallWidth.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('information-circle');
    await userEvent.hover(button);
};
