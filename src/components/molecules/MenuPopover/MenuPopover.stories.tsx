import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { MenuItem, Separator } from 'src/components/atoms';
import { MenuPopover } from './MenuPopover';

const menuButton = (
    <>
        <p>More</p>
        <EllipsisHorizontalIcon className='ml-1 h-5 w-5' />
    </>
);

const menuContent = (
    <>
        {Array(5)
            .fill('_')
            .map((_, index) => (
                <div key={index}>
                    <MenuItem text={`Menu Item ${index + 1}`} key={index} />
                    {index !== 4 && (
                        <div className='py-2'>
                            <Separator />
                        </div>
                    )}
                </div>
            ))}
    </>
);

export default {
    title: 'Organism/MenuPopover',
    component: MenuPopover,
    parameters: {
        viewport: {
            disable: true,
        },
    },
    args: {
        menuButton: menuButton,
        menuContent: menuContent,
    },
} as Meta<typeof MenuPopover>;

const Template: StoryFn<typeof MenuPopover> = args => (
    <div className='w-fit'>
        <MenuPopover {...args} />
    </div>
);

export const Default = Template.bind({});
export const Expanded = Template.bind({});
Expanded.play = ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole('button');
    menuButton.click();
};
