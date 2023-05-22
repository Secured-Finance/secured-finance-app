import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { CollateralOrganism } from './CollateralOrganism';
import { emptyCollateralBook } from 'src/stories/mocks/fixtures';

export default {
    title: 'Organism/CollateralOrganism',
    component: CollateralOrganism,
    args: {
        collateralBook: emptyCollateralBook,
    },
    decorators: [withWalletProvider],
} as ComponentMeta<typeof CollateralOrganism>;

const Template: ComponentStory<typeof CollateralOrganism> = args => (
    <CollateralOrganism {...args} />
);

export const Default = Template.bind({});
