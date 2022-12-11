import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { ConnectWalletCard } from '.';

export default {
    title: 'Organism/ConnectWalletCard',
    component: ConnectWalletCard,
    decorators: [withWalletProvider],
} as ComponentMeta<typeof ConnectWalletCard>;

const Template: ComponentStory<typeof ConnectWalletCard> = () => (
    <div className='w-[350px]'>
        <ConnectWalletCard />
    </div>
);

export const Default = Template.bind({});
