import type { Meta, StoryFn } from '@storybook/react';
import { Chip } from './Chip';
import { FIGMA_STORYBOOK_LINK } from './constants';
import { ChipColors, ChipSizes } from './types';

export default {
    title: 'Atoms/Chip',
    component: Chip,
    args: {
        label: 'Borrow',
    },
    argTypes: {
        color: { control: 'select', options: Object.values(ChipColors) },
        size: { control: 'radio', options: Object.values(ChipSizes) },
        label: {
            control: 'text',
        },
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
} as Meta<typeof Chip>;

const Template: StoryFn<typeof Chip> = args => <Chip {...args} />;

export const Chips = () => {
    return (
        <div className='flex flex-col items-start gap-4'>
            <Chip label='Lend' size={ChipSizes.sm} />
            <Chip color={ChipColors.Green} label='Label' />
            <Chip color={ChipColors.Red} label='Label' size={ChipSizes.lg} />
            <Chip color={ChipColors.Yellow} label='Label' />
            <Chip color={ChipColors.Teal} label='Label' />
            <Chip color={ChipColors.Blue} label='Label' />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    size: ChipSizes.md,
};

export const Small = Template.bind({});
Small.args = {
    size: ChipSizes.sm,
};

export const Large = Template.bind({});
Large.args = {
    size: ChipSizes.lg,
};

export const Green = Template.bind({});
Green.args = {
    color: ChipColors.Green,
};

export const Red = Template.bind({});
Red.args = {
    color: ChipColors.Red,
};

export const Yellow = Template.bind({});
Yellow.args = {
    color: ChipColors.Yellow,
};

export const Teal = Template.bind({});
Teal.args = {
    color: ChipColors.Teal,
};

export const Blue = Template.bind({});
Blue.args = {
    color: ChipColors.Blue,
};
