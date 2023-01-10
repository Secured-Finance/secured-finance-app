import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { aggregatedTrades } from 'src/stories/mocks/fixtures';
import { ActiveTradeTable } from './ActiveTradeTable';

export default {
    title: 'Organism/ActiveTradeTable',
    component: ActiveTradeTable,
    args: {
        data: aggregatedTrades,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof ActiveTradeTable>;

const Template: ComponentStory<typeof ActiveTradeTable> = args => {
    return <ActiveTradeTable {...args} />;
};

export const Default = Template.bind({});
