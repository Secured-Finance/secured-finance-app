import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import { formatTimeStampWithTimezone } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import * as stories from './AdvancedLendingTopBar.stories';

const { Default, Values } = composeStories(stories);

describe('AdvancedLendingTopBar Component', () => {
    it('should render a AdvancedLendingTopBar without the values', () => {
        render(<Default />);

        expect(
            screen.getByRole('button', { name: 'WFIL' })
        ).toBeInTheDocument();
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();

        expect(screen.getByText('80.00')).toBeInTheDocument();
        expect(screen.getByText('25.03% APR')).toBeInTheDocument();
        expect(
            screen.getByText(formatTimeStampWithTimezone(1646920200))
        ).toBeInTheDocument();
    });

    it('should render a AdvancedLendingTopBar with the values', () => {
        render(<Values />);

        expect(screen.getByText('24h High')).toBeInTheDocument();
        expect(screen.getByText('24h Low')).toBeInTheDocument();
        expect(screen.getByText('24h Trades')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();

        expect(screen.getByText('26.16')).toBeInTheDocument();
        expect(screen.getByText('24.2')).toBeInTheDocument();
        expect(screen.getByText('894')).toBeInTheDocument();
        expect(screen.getByText('10,000,000')).toBeInTheDocument();
        expect(screen.getByText('23000')).toBeInTheDocument();
    });

    it('should render source link for the selected asset', () => {
        render(<Default />);

        expect(
            screen.getByRole('button', { name: 'WFIL' })
        ).toBeInTheDocument();
        const source = screen.getByRole('link');
        expect(source).toBeInTheDocument();
        expect(source).toHaveAttribute(
            'href',
            'https://www.coingecko.com/en/coins/filecoin'
        );
    });

    describe('Current Market', () => {
        it('should show that the current market is an opening price if indicated', () => {
            render(
                <Default
                    currentMarket={{
                        value: LoanValue.fromPrice(8000, 1643713200),
                        time: 1643713200,
                        type: 'opening',
                    }}
                />
            );
            expect(screen.getByText('Opening Price')).toBeInTheDocument();
            expect(
                screen.queryByText(`${formatTimeStampWithTimezone(1643713200)}`)
            ).not.toBeInTheDocument();
        });

        it('should show that the current market is a last block price if indicated', () => {
            render(
                <Default
                    currentMarket={{
                        value: LoanValue.fromPrice(8000, 1643713200),
                        time: 1643713200,
                        type: 'block',
                    }}
                />
            );
            expect(
                screen.getByText(`${formatTimeStampWithTimezone(1643713200)}`)
            ).toBeInTheDocument();
        });

        it('should show the current market box in gray if there is no current market', () => {
            render(<Default currentMarket={undefined} />);
            expect(
                screen.queryByLabelText('Current Market')
            ).toBeInTheDocument();
            expect(
                screen.queryByLabelText('Current Market')?.children[0]
            ).toHaveClass('text-slateGray');
        });
    });
});
