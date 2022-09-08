import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CollateralUsageSection } from './';

export default {
    title: 'Atoms/CollateralUsageSection',
    component: CollateralUsageSection,
    args: {
        available: '100',
        usage: '50%',
    },
} as ComponentMeta<typeof CollateralUsageSection>;

const Template: ComponentStory<typeof CollateralUsageSection> = args => (
    <CollateralUsageSection {...args} />
);

export const Default = Template.bind({});
