import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Meta, StoryFn } from '@storybook/react';
import { ButtonSizes } from 'src/types';
import { IconButton } from './IconButton';
import { IconButtonVariants } from './types';

export default {
    title: 'Atoms/IconButton',
    component: IconButton,
    args: {
        onClick: () => {},
        Icon: PlusIcon,
        size: ButtonSizes.md,
        disabled: false,
    },
    argTypes: {
        size: { control: 'radio', options: Object.values(ButtonSizes) },
        variant: {
            control: 'radio',
            options: Object.values(IconButtonVariants),
        },
    },
} as Meta<typeof IconButton>;

const Template: StoryFn<typeof IconButton> = args => (
    <IconButton
        onClick={args.onClick}
        Icon={args.Icon}
        size={args.size}
        variant={args.variant}
    />
);

export const Primary = Template.bind({});
Primary.args = {
    variant: IconButtonVariants.primary,
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
    ...Primary.args,
    size: ButtonSizes.xs,
};

export const Small = Template.bind({});
Small.args = {
    ...Primary.args,
    size: ButtonSizes.sm,
};

export const Medium = Template.bind({});
Medium.args = {
    ...Primary.args,
    size: ButtonSizes.md,
};

export const Large = Template.bind({});
Large.args = {
    ...Primary.args,
    size: ButtonSizes.lg,
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: IconButtonVariants.secondary,
};

export const SecondaryBuy = Template.bind({});
SecondaryBuy.args = {
    variant: IconButtonVariants.secondaryBuy,
};

export const SecondarySell = Template.bind({});
SecondarySell.args = {
    variant: IconButtonVariants.secondarySell,
};

export const CloseButton = Template.bind({});
CloseButton.args = {
    ...Primary.args,
    Icon: XMarkIcon,
};
