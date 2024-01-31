import { StarIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';
import { Button } from './';
import { FIGMA_STORYBOOK_LINK } from './constants';
import { ButtonSizes, ButtonVariants } from './types';

export default {
    title: 'Atoms/Button',
    component: Button,
    args: {
        children: 'Connect Wallet',
    },
    argTypes: {
        children: { control: 'text' },
        size: { control: 'radio', options: Object.values(ButtonSizes) },
        variant: { control: 'radio', options: Object.values(ButtonVariants) },
        fullWidth: { control: 'boolean' },
        StartIcon: { control: false },
        EndIcon: { control: false },
    },
    parameters: {
        viewport: {
            disable: true,
        },
        design: {
            type: 'figma',
            url: FIGMA_STORYBOOK_LINK,
        },
    },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = args => (
    <Button {...args}>{args.children}</Button>
);

export const Primary = () => {
    return (
        <div className='grid gap-4'>
            <Button size={ButtonSizes.xs}>Unwind</Button>
            <Button size={ButtonSizes.sm}>Deposit</Button>
            <Button size={ButtonSizes.md}>Connect Wallet</Button>
            <Button size={ButtonSizes.lg}>Place Order</Button>
            <Button disabled>Disabled</Button>
            <Button variant={ButtonVariants.secondary}>Order</Button>
            <Button
                size={ButtonSizes.md}
                variant={ButtonVariants.tertiary}
                fullWidth
            >
                Full Width
            </Button>
            <Button StartIcon={StarIcon}>Icons</Button>
            <Button EndIcon={StarIcon}>Icons</Button>
        </div>
    );
};

export const Default = Template.bind({});

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
    ...Default.args,
    size: ButtonSizes.xs,
};

export const Small = Template.bind({});
Small.args = {
    ...Default.args,
    size: ButtonSizes.sm,
};

export const Medium = Template.bind({});
Medium.args = {
    ...Default.args,
    size: ButtonSizes.md,
};

export const Large = Template.bind({});
Large.args = {
    ...Default.args,
    size: ButtonSizes.lg,
};

export const Secondary = Template.bind({});
Secondary.args = {
    ...Default.args,
    variant: ButtonVariants.secondary,
};

export const Tertiary = Template.bind({});
Tertiary.args = {
    ...Default.args,
    variant: ButtonVariants.tertiary,
};

export const PrimaryBuy = Template.bind({});
PrimaryBuy.args = {
    ...Default.args,
    variant: ButtonVariants.primaryBuy,
};

export const PrimarySell = Template.bind({});
PrimarySell.args = {
    ...Default.args,
    variant: ButtonVariants.primarySell,
};

export const SecondaryNeutral = Template.bind({});
SecondaryNeutral.args = {
    ...Default.args,
    variant: ButtonVariants.secondaryNeutral,
};

export const TertiaryBuy = Template.bind({});
TertiaryBuy.args = {
    ...Default.args,
    variant: ButtonVariants.tertiaryBuy,
};

export const TertiarySell = Template.bind({});
TertiarySell.args = {
    ...Default.args,
    variant: ButtonVariants.tertiarySell,
};
