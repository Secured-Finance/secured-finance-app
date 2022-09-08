import { ComponentMeta, ComponentStory } from '@storybook/react';
import theme from 'src/theme';
import { ThemeProvider } from 'styled-components';

import { CurrencySelector } from '.';

export default {
    title: 'Components/Molecules/CurrencySelector',
    component: CurrencySelector,
    args: {
        selectedCcy: 'ETH',
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof CurrencySelector>;

const Template: ComponentStory<typeof CurrencySelector> = args => (
    <ThemeProvider theme={theme}>
        <CurrencySelector {...args} />
    </ThemeProvider>
);

export const Default = Template.bind({});
