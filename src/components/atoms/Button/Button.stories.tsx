import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import theme from 'src/theme';

import { Button } from './';

export default {
    title: 'Components/Atoms/Button',
    component: Button,
    args: {
        text: 'Button',
        variant: 'blue',
    },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => (
    <ThemeProvider theme={theme}>
        <Button {...args} />
    </ThemeProvider>
);

export const Default = Template.bind({});

export const Orange = Template.bind({});
Orange.args = {
    variant: 'orange',
};
