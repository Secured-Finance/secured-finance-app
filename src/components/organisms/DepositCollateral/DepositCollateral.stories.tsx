import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { DepositCollateral } from './DepositCollateral';

export default {
    title: 'Organism/DepositCollateral',
    component: DepositCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
    },
    decorators: [WithAssetPrice, WithWalletProvider],
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof DepositCollateral>;

const Template: ComponentStory<typeof DepositCollateral> = args => (
    <DepositCollateral {...args} />
);

export const Default = Template.bind({});
