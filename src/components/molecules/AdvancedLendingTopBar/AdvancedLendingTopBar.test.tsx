import { composeStories } from '@storybook/testing-react';
import { render, screen, within } from 'src/test-utils.js';
import * as stories from './AdvancedLendingTopBar.stories';

const { Default, Values } = composeStories(stories);

describe('AdvancedLendingTopBar Component', () => {
    it('should render a default AdvancedLendingTopBar with lastTradePrice', () => {
        render(<Default />);

        expect(
            screen.getByRole('button', { name: 'EFIL' })
        ).toBeInTheDocument();
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();

        expect(screen.getByText('24h High')).toBeInTheDocument();
        expect(screen.getByText('24h Low')).toBeInTheDocument();
        expect(screen.getByText('24h Trades')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
        expect(screen.getAllByText('0')).toHaveLength(5);
        expect(screen.getByText('80.00')).toBeInTheDocument();
        expect(screen.getByText('25.03% APR')).toBeInTheDocument();
    });

    it('should render the values on the AdvancedLendingTopBar', () => {
        render(<Values />);

        expect(screen.getByText('26.16')).toBeInTheDocument();
        expect(screen.getByText('24.2')).toBeInTheDocument();
        expect(screen.getByText('894')).toBeInTheDocument();
        expect(screen.getByText('10,000,000')).toBeInTheDocument();
        expect(screen.getByText('23000')).toBeInTheDocument();
    });

    it('should render source link for the selected asset', () => {
        render(<Default />);

        expect(
            screen.getByRole('button', { name: 'EFIL' })
        ).toBeInTheDocument();
        const source = screen.getByRole('link');
        expect(source).toBeInTheDocument();
        expect(source).toHaveAttribute(
            'href',
            'https://www.coingecko.com/en/coins/filecoin'
        );
    });

    it('should indicate the last price is an opening price if there is no last trade time', () => {
        render(<Default lastTradeTime={undefined} />);
        expect(screen.getByText('Opening Price')).toBeInTheDocument();
    });

    it('should show 0 as a value for the last trade price if there is no last trade', () => {
        render(<Default lastTradeLoan={undefined} />);
        const lastTradeTab = within(
            screen.getByLabelText('Last Trade Analytics')
        );
        expect(lastTradeTab.getByText('0')).toBeInTheDocument();
        expect(lastTradeTab.getByText('0 APR')).toBeInTheDocument();
    });
});
