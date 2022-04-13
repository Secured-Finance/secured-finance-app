import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import theme from 'src/theme';

import { CurrencySelector } from '.';

export default {
    title: 'Components/Molecules/CurrencySelector',
    component: CurrencySelector,
    args: {
        selectedCcy: 'ETH',
    },
} as ComponentMeta<typeof CurrencySelector>;

const Template: ComponentStory<typeof CurrencySelector> = args => (
    <ThemeProvider theme={theme}>
        <CurrencySelector {...args} />
    </ThemeProvider>
);

export const Default = Template.bind({});
