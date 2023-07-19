import type { Meta, StoryFn } from '@storybook/react';
import { Footer } from './Footer';

export default {
    title: 'Atoms/Footer',
    component: Footer,
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = () => <Footer />;

export const Default = Template.bind({});
