import { composeStories } from '@storybook/react';
import { userEvent } from '@storybook/testing-library';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import timemachine from 'timemachine';
import * as stories from './ActiveTradeTable.stories';

const { Default, Delisted } = composeStories(stories);

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-02-01T11:00:00.00Z',
    });
});

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('ActiveTradeTable Component', () => {
    it('should render a ActiveTradeTable as a table', () => {
        render(<Default />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should sort the table by position', () => {
        render(<Default />);
        const initialRows = screen.getAllByRole('row');
        expect(initialRows[1]).toHaveTextContent('Lend');
        expect(initialRows[2]).toHaveTextContent('Borrow');
        expect(initialRows[3]).toHaveTextContent('Borrow');
        expect(initialRows[4]).toHaveTextContent('Lend');
        expect(initialRows[5]).toHaveTextContent('Lend');
        expect(initialRows[6]).toHaveTextContent('Lend');
        expect(initialRows[7]).toHaveTextContent('Lend');
        expect(initialRows[8]).toHaveTextContent('Borrow');
        expect(initialRows[9]).toHaveTextContent('Borrow');
        screen.getByText('Type').click();
        const sortedRowsAsc = screen.getAllByRole('row');
        expect(sortedRowsAsc[1]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[2]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[3]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[4]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[5]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[6]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[7]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[8]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[9]).toHaveTextContent('Borrow');
        screen.getByText('Type').click();
        const sortedRowsDesc = screen.getAllByRole('row');
        expect(sortedRowsDesc[1]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[2]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[3]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[4]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[5]).toHaveTextContent('Lend');
        expect(sortedRowsDesc[6]).toHaveTextContent('Lend');
        expect(sortedRowsDesc[7]).toHaveTextContent('Lend');
        expect(sortedRowsDesc[8]).toHaveTextContent('Lend');
        expect(sortedRowsDesc[9]).toHaveTextContent('Lend');
    });

    it('should display correct color code for future value', () => {
        render(<Default />); // this is definitely not working
        const rows = screen.getAllByTestId('currency-amount-item');
        let firstSpan = rows[0].querySelector('span');
        expect(firstSpan?.classList).toContain('text-nebulaTeal');
        firstSpan = rows[2].querySelector('span');
        expect(firstSpan?.classList).toContain('text-galacticOrange');
        firstSpan = rows[4].querySelector('span');
        expect(firstSpan?.classList).toContain('text-galacticOrange');
        firstSpan = rows[6].querySelector('span');
        expect(firstSpan?.classList).toContain('text-nebulaTeal');
        firstSpan = rows[8].querySelector('span');
        expect(firstSpan?.classList).toContain('text-nebulaTeal');
        firstSpan = rows[10].querySelector('span');
        expect(firstSpan?.classList).toContain('text-nebulaTeal');
    });

    it('should display more options when clicking on the ... button', () => {
        render(<Default />);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        const moreOptionsButton = screen.getAllByRole('button', {
            name: 'More options',
        });
        expect(moreOptionsButton).toHaveLength(9);
        fireEvent.click(moreOptionsButton[0]);
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getByText('Add/Reduce Position')).toBeInTheDocument();
        expect(screen.getByText('Unwind Position')).toBeInTheDocument();
    });

    it('should display the unwind dialog when clicking on the Unwind Position button', () => {
        render(<Default />);
        expect(screen.queryByText('Unwind Position')).not.toBeInTheDocument();
        const moreOptionsButton = screen.getAllByRole('button', {
            name: 'More options',
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.click(moreOptionsButton[0]);
        fireEvent.click(screen.getByText('Unwind Position'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display hours and minutes when maturity is less than 24 hours', async () => {
        render(<Default />);
        const closeToMaturityRow = screen.getAllByRole('row')[8];
        expect(closeToMaturityRow).toHaveTextContent('Feb 2, 2022');
        waitFor(() => {
            expect(closeToMaturityRow).toHaveTextContent('21h-59m');
        });
    });

    it('should display 1 day when maturity is less than 48 hours and greater than 24 hours', async () => {
        render(<Default />);
        const closeToMaturityRow = screen.getAllByRole('row')[6];
        expect(closeToMaturityRow).toHaveTextContent('Feb 2, 2022');
        await waitFor(() => {
            expect(closeToMaturityRow).toHaveTextContent('1 Day');
        });
    });

    it('should show table hints', async () => {
        render(<Default />);
        const maturity = screen.getByText('Maturity');
        expect(
            screen.queryByText(
                'Maturity of a loan contract is the date on which the contract is set to expire.'
            )
        ).not.toBeInTheDocument();
        await waitFor(async () => {
            await userEvent.hover(maturity);
        });
        waitFor(() => {
            expect(
                screen.queryByText(
                    'Maturity of a loan contract is the date on which the contract is set to expire.'
                )
            ).toBeInTheDocument();
        });
    });

    describe('delisted contracts', () => {
        it('should display maturity in galacticOrange', () => {
            render(<Delisted />);
            const delistedContractRow = screen.getAllByRole('row')[2];
            expect(delistedContractRow).toHaveTextContent('392 Days');
            const maturity = screen.getByText('392 Days');
            expect(maturity).toBeInTheDocument();
            expect(maturity.parentNode).toHaveClass('text-galacticOrange');
        });
        it('should display unwind position till 7 days since maturity for lend orders', async () => {
            render(<Delisted />);
            const closeToMaturityRow = screen.getAllByRole('row')[5];
            expect(closeToMaturityRow).toHaveTextContent('Jan 25, 2022');
            await waitFor(() => {
                expect(closeToMaturityRow).toHaveTextContent('-6 Days');
            });
            const moreOptionsButton = screen.getAllByRole('button', {
                name: 'More options',
            });
            fireEvent.click(moreOptionsButton[4]);
            fireEvent.click(screen.getByText('Unwind Position'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should display redeem position after 7 days since maturity for lend orders', async () => {
            render(<Delisted />);
            const closeToMaturityRow = screen.getAllByRole('row')[7];
            expect(closeToMaturityRow).toHaveTextContent('Jan 22, 2022');
            await waitFor(() => {
                expect(closeToMaturityRow).toHaveTextContent('-10 Days');
            });
            const moreOptionsButton = screen.getAllByRole('button', {
                name: 'More options',
            });
            fireEvent.click(moreOptionsButton[6]);
            fireEvent.click(screen.getByText('Redeem Position'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should display unwind position if not within 7 days of maturity for borrow orders', async () => {
            render(<Delisted />);
            const closeToMaturityRow = screen.getAllByRole('row')[2];
            expect(closeToMaturityRow).toHaveTextContent('Mar 1, 2023');
            await waitFor(() => {
                expect(closeToMaturityRow).toHaveTextContent('392 Days');
            });
            const moreOptionsButton = screen.getAllByRole('button', {
                name: 'More options',
            });
            fireEvent.click(moreOptionsButton[1]);
            fireEvent.click(screen.getByText('Unwind Position'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should display repay position if within 7 days before maturity for borrow orders', async () => {
            render(<Delisted />);
            const closeToMaturityRow = screen.getAllByRole('row')[8];
            expect(closeToMaturityRow).toHaveTextContent('Feb 2, 2022');
            waitFor(() => {
                expect(closeToMaturityRow).toHaveTextContent('21h-59m');
            });
            const moreOptionsButton = screen.getAllByRole('button', {
                name: 'More options',
            });
            fireEvent.click(moreOptionsButton[7]);
            fireEvent.click(screen.getByText('Repay Position'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should display repay position if within 7 days post maturity for borrow orders', async () => {
            render(<Delisted />);
            const postMaturity = screen.getAllByRole('row')[9];
            expect(postMaturity).toHaveTextContent('Jan 27, 2022');
            await waitFor(() => {
                expect(postMaturity).toHaveTextContent('-5 Days');
            });
            const moreOptionsButton = screen.getAllByRole('button', {
                name: 'More options',
            });
            fireEvent.click(moreOptionsButton[8]);
            fireEvent.click(screen.getByText('Repay Position'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });
});
