import {
    ChevronDoubleDownIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { expect } from '@storybook/jest';
import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent, waitFor, within } from '@storybook/testing-library';
import { Tooltip } from './Tooltip';
import { TooltipMode } from './types';

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
    <p>If the conditions are fulfilled, the trade will be executed.</p>
);

export default {
    title: 'Molecules/Tooltip',
    component: Tooltip,
    args: {
        children: children,
        iconElement: InformationIcon,
    },
    parameters: {
        chromatic: { delay: 5000 },
    },
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = args => (
    <div className='mx-10 flex h-full w-full justify-center'>
        <Tooltip {...args} />
    </div>
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
    await waitFor(async () => {
        await expect(
            screen.getByText(
                'If the conditions are fulfilled, the trade will be executed.'
            )
        ).toBeInTheDocument();
    });
};

export const Success = Template.bind({});
Success.args = {
    mode: TooltipMode.Success,
};
Success.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};

export const Warning = Template.bind({});
Warning.args = {
    mode: TooltipMode.Warning,
};
Warning.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};

export const Error = Template.bind({});
Error.args = {
    mode: TooltipMode.Error,
};
Error.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('information-circle');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};

export const WithCustomHoverIcon = Template.bind({});
WithCustomHoverIcon.args = {
    iconElement: ButtonIcon,
};

WithCustomHoverIcon.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('button-icon');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};
