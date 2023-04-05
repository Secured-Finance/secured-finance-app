import { ComponentMeta, ComponentStory } from '@storybook/react';
import { walletSourceList } from 'src/stories/mocks/fixtures';
import { WalletSourceSelector } from './WalletSourceSelector';

export default {
    title: 'Atoms/WalletSourceSelector',
    component: WalletSourceSelector,
    args: {
        optionList: walletSourceList,
        selected: walletSourceList[0],
        onChange: () => {},
    },
} as ComponentMeta<typeof WalletSourceSelector>;

const Template: ComponentStory<typeof WalletSourceSelector> = args => (
    <div className='w-[360px]'>
        <WalletSourceSelector {...args} />
    </div>
);

export const Default = Template.bind({});
