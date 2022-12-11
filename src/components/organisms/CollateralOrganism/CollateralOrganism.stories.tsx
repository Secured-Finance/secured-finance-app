import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { CollateralOrganism } from './CollateralOrganism';

export default {
    title: 'Organism/CollateralOrganism',
    component: CollateralOrganism,
    args: {},
    decorators: [withWalletProvider],
} as ComponentMeta<typeof CollateralOrganism>;

const Template: ComponentStory<typeof CollateralOrganism> = () => (
    <CollateralOrganism />
);

export const Default = Template.bind({});
