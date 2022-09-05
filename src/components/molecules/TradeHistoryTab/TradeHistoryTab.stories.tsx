import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TradeHistoryTab } from './TradeHistoryTab';

export default {
    title: 'Molecules/TradeHistoryTab',
    component: TradeHistoryTab,
    args: {},
} as ComponentMeta<typeof TradeHistoryTab>;

const Template: ComponentStory<typeof TradeHistoryTab> = () => (
    <div className='h-[400px] w-[600px] text-white-80'>
        <TradeHistoryTab tabTitles={['Active Contracts', 'Trade History']}>
            <div>This is a Great Tab Content</div>
            <div className='py-12'>This is the content of the second tab</div>
        </TradeHistoryTab>
    </div>
);

export const Default = Template.bind({});
