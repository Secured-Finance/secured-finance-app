import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ledgerLogo from 'src/assets/img/ledger.svg';
import theme from 'src/theme';
import { ThemeProvider } from 'styled-components';
import WalletCard from './WalletCard';

export default {
    title: 'Organism/WalletProviderModal/WalletCard',
    component: WalletCard,
    argTypes: {
        onConnect: { action: 'clicked' },
        title: { control: 'text', defaultValue: 'Ledger' },
        buttonText: { control: 'text', defaultValue: 'Connect' },
    },
} as ComponentMeta<typeof WalletCard>;

const Template: ComponentStory<typeof WalletCard> = args => (
    <ThemeProvider theme={theme}>
        <WalletCard
            icon={
                <img
                    src={ledgerLogo}
                    style={{ height: 26 }}
                    alt='Ledger Wallet'
                />
            }
            onConnect={() => {}}
            title={args.title}
            buttonText={args.buttonText}
        />
    </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
    title: 'Ledger Wallet',
};
