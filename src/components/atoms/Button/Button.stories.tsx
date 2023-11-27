import { StarIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';
import { Button } from './';

export default {
    title: 'Atoms/Button',
    component: Button,
    args: {
        children: 'Connect Wallet',
    },
    argTypes: {
        children: { control: 'text' },
        size: { control: 'radio', options: ['sm', 'md'] },
        fullWidth: { control: 'boolean' },
        StartIcon: { control: false },
        EndIcon: { control: false },
    },
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = args => (
    <Button {...args}>{args.children}</Button>
);

export const Primary = () => {
    return (
        <div className='grid gap-4'>
            <Button size='xs'>Unwind</Button>
            <Button size='sm'>Deposit</Button>
            <Button size='md'>Connect Wallet</Button>
            <Button disabled>Disabled</Button>
            <Button size='md' fullWidth>
                Full Width
            </Button>
            <Button StartIcon={StarIcon}>Icons</Button>
            <Button EndIcon={StarIcon}>Icons</Button>
        </div>
    );
};

export const Default = Template.bind({});

export const Small = Template.bind({});
Small.args = {
    ...Default.args,
    size: 'sm',
};

export const Medium = Template.bind({});
Medium.args = {
    ...Default.args,
    size: 'md',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    ...Default.args,
    StartIcon: StarIcon,
};

export const Outlined = Template.bind({});
Outlined.args = {
    variant: 'outlined',
};
