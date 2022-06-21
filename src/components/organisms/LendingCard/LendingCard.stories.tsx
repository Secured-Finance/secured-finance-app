import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LendingCard } from './LendingCard';

export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {},
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof LendingCard>;

const Template: ComponentStory<typeof LendingCard> = args => <LendingCard />;

export const Default = Template.bind({});
