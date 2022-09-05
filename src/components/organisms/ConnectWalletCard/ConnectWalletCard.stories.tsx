import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { ConnectWalletCard } from '.';

export default {
    title: 'Organism/ConnectWalletCard',
    component: ConnectWalletCard,
    decorators: [WithWalletProvider],
} as ComponentMeta<typeof ConnectWalletCard>;

const Template: ComponentStory<typeof ConnectWalletCard> = () => (
    <div className='w-[350px]'>
        <ConnectWalletCard />
    </div>
);

export const Default = Template.bind({});
