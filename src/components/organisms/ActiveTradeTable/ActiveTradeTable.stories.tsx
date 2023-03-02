import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { aggregatedTrades } from 'src/stories/mocks/fixtures';
import { ActiveTradeTable } from './ActiveTradeTable';

export default {
    title: 'Organism/ActiveTradeTable',
    component: ActiveTradeTable,
    args: {
        data: aggregatedTrades,
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof ActiveTradeTable>;

const Template: ComponentStory<typeof ActiveTradeTable> = args => {
    return (
        <div className='px-24'>
            <ActiveTradeTable {...args} />
        </div>
    );
};

export const Default = Template.bind({});
