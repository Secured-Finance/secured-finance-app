import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { AdvancedLendingOrderCard } from './AdvancedLendingOrderCard';

export default {
    title: 'Organism/AdvancedLendingOrderCard',
    component: AdvancedLendingOrderCard,
    args: {
        collateralBook: collateralBook37,
    },
    parameters: {
        connected: true,
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof AdvancedLendingOrderCard>;

const Template: ComponentStory<typeof AdvancedLendingOrderCard> = args => {
    return <AdvancedLendingOrderCard {...args} />;
};

export const Default = Template.bind({});
