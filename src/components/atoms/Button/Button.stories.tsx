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
        variant: { control: 'select', options: ['contained', 'outlined'] },
        size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => (
    <Button {...args}>{args.children}</Button>
);

export const Primary = () => {
    return (
        <>
            <ul style={{ padding: '10px' }}>
                <li style={{ padding: '10px' }}>
                    <Button variant='contained' size='xs'>
                        Deposit
                    </Button>
                </li>
                <li style={{ padding: '10px' }}>
                    <Button variant='contained' size='sm'>
                        Connect Wallet
                    </Button>
                </li>
                <li style={{ padding: '10px' }}>
                    <Button variant='contained' size='md'>
                        Connect Wallet
                    </Button>
                </li>
                <li style={{ padding: '10px' }}>
                    <Button variant='contained' size='lg'>
                        Connect Wallet
                    </Button>
                </li>
            </ul>
        </>
    );
};

export const Default = Template.bind({});

export const XS = Template.bind({});
XS.args = {
    ...Default.args,
    children: 'Deposit',
    size: 'xs',
};

export const SM = Template.bind({});
SM.args = {
    ...Default.args,
    size: 'sm',
};

export const MD = Template.bind({});
MD.args = {
    ...Default.args,
    size: 'md',
};

export const LG = Template.bind({});
LG.args = {
    ...Default.args,
    size: 'lg',
};

export const Outlined = Template.bind({});
Outlined.args = {
    variant: 'outlined',
};

export const Link = Template.bind({});
Link.args = {
    href: 'http://www.google.com',
};
