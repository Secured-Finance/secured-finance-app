import { Meta, Story } from '@storybook/react';
import { StorybookProviders } from 'src/setupStorybook';
import {
    updateEthWalletBalance,
    updateFilWalletBalance,
} from 'src/store/wallets';
import { currencyList } from 'src/utils/currencyList';
import SendModal from './SendModal';

const PopulateStore = [updateFilWalletBalance(100), updateEthWalletBalance(12)];

export default {
    title: 'components/organisms/SendModal/SendModal',
    component: SendModal,
    decorators: [
        Story => (
            <StorybookProviders dispatchFunctionList={PopulateStore}>
                <Story />
            </StorybookProviders>
        ),
    ],
} as Meta;

export const Default: Story = () => {
    return <SendModal currencyInfo={currencyList[0]} />;
};

export const Filecoin: Story = () => {
    return <SendModal currencyInfo={currencyList[1]} />;
};

export const PreFilledFilecoin: Story = () => {
    return (
        <SendModal
            currencyInfo={currencyList[1]}
            amount={0.1}
            toAddress='0x0000000000000000000000000000000000000000'
        />
    );
};
