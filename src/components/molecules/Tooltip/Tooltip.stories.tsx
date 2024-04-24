import {
    ChevronDoubleDownIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
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
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = args => (
    <div className='mx-10 flex h-full w-full justify-center'>
        <Tooltip {...args} />
    </div>
);

export const Default = Template.bind({});
Default.play = async () => {
    const button = await screen.getByTestId('information-circle');
    await userEvent.hover(button);
};

export const Success = Template.bind({});
Success.args = {
    mode: TooltipMode.Success,
};
Success.play = async () => {
    const button = screen.getByTestId('information-circle');
    await userEvent.hover(button);
};

export const Warning = Template.bind({});
Warning.args = {
    mode: TooltipMode.Warning,
};
Warning.play = async () => {
    const button = screen.getByTestId('information-circle');
    await userEvent.hover(button);
};

export const Error = Template.bind({});
Error.args = {
    mode: TooltipMode.Error,
};
Error.play = async () => {
    const button = screen.getByTestId('information-circle');
    await userEvent.hover(button);
};

export const WithCustomHoverIcon = Template.bind({});
WithCustomHoverIcon.args = {
    iconElement: ButtonIcon,
};

WithCustomHoverIcon.play = async () => {
    const button = screen.getByTestId('button-icon');
    await userEvent.hover(button);
};
