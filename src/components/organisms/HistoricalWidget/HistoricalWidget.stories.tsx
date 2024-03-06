import type { Meta, StoryFn } from '@storybook/react';
import { mockTransactionCandleStick } from 'src/stories/mocks/queries';
import { HistoricalWidget } from './HistoricalWidget';

export default {
    title: 'Organism/HistoricalWidget',
    component: HistoricalWidget,
    parameters: {
        apolloClient: {
            mocks: [...mockTransactionCandleStick],
        },
    },
    argTypes: {},
} as Meta<typeof HistoricalWidget>;

const Template: StoryFn<typeof HistoricalWidget> = () => {
    return (
        <div className='w-[600px]'>
            <HistoricalWidget />
        </div>
    );
};

export const Default = Template.bind({});
