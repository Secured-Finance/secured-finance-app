import { StarIcon } from '@heroicons/react/24/solid';
import { ComponentMeta, ComponentStory } from '@storybook/react';
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
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => (
    <Button {...args}>{args.children}</Button>
);

export const Primary = () => {
    return (
        <div className='grid gap-4'>
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
