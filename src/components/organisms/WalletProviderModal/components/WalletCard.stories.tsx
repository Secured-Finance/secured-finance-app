import { ComponentMeta, ComponentStory } from '@storybook/react';
import LedgerLogo from 'src/assets/img/ledger.svg';
import theme from 'src/theme';
import { ThemeProvider } from 'styled-components';
import WalletCard from './WalletCard';

export default {
    title: 'Components/Organisms/WalletProviderModal/WalletCard',
    component: WalletCard,
    argTypes: {
        onConnect: { action: 'clicked' },
        title: { control: 'text' },
        buttonText: { control: 'text' },
    },
} as ComponentMeta<typeof WalletCard>;

const Template: ComponentStory<typeof WalletCard> = args => (
    <ThemeProvider theme={theme}>
        <WalletCard
            icon={<LedgerLogo style={{ height: 26 }} />}
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
