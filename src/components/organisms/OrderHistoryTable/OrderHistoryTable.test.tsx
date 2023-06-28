import { composeStories } from '@storybook/testing-react';
import { render, screen, fireEvent } from 'src/test-utils.js';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import * as stories from './OrderHistoryTable.stories';

const { Default } = composeStories(stories);
const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('OrderHistoryTable Component', () => {
    it('should render a TradeHistoryTable', () => {
        render(<Default />);
        expect(screen.getAllByTestId('order-history-table-row')).toHaveLength(
            9
        );
    });

    it('should open etherscan link', () => {
        window.open = jest.fn();
        render(<Default />);
        const rows = screen.getAllByTestId('order-history-table-row');
        const actionButton = rows[0].querySelectorAll('button')[0];
        fireEvent.click(actionButton);
        const etherscanButton = rows[0].querySelectorAll('button')[1];
        fireEvent.click(etherscanButton);
        expect(window.open).toHaveBeenCalledWith(
            'https://sepolia.etherscan.io/tx/0x6861736800000000000000000000000000000000000000000000000000000000',
            '_blank'
        );
    });
});
