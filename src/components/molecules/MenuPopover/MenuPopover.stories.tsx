import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';

import { withWalletProvider } from 'src/../.storybook/decorators';
import { MenuPopover } from './MenuPopover';

export default {
    title: 'Organism/MenuPopover',
    component: MenuPopover,
    args: {},
    argTypes: {},
    decorators: [withWalletProvider],
} as ComponentMeta<typeof MenuPopover>;

const Template: ComponentStory<typeof MenuPopover> = args => (
    <div className='ml-[1000px]'>
        <MenuPopover {...args} />
    </div>
);

export const Default = Template.bind({});
export const Expanded = Template.bind({});
Expanded.play = ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const walletButton = canvas.getByRole('button');
    walletButton.click();
};
