import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { useGraphClientHook } from 'src/hooks';
import { HistoricalDataIntervals } from 'src/types';
import * as stories from './HistoricalWidget.stories';

jest.mock('src/hooks', () => ({
    ...jest.requireActual('src/hooks'),
    useGraphClientHook: jest.fn(),
}));

const { Default } = composeStories(stories);
const mockedUseGraphClientHook = useGraphClientHook as jest.Mock;

describe('HistoricalWidget', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseGraphClientHook.mockReturnValue({
            data: { transactionCandleSticks: [] },
        });
    });

    it('should render timescales', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        const timeScalesContainer = screen.getByTestId('timescale-selector');
        expect(timeScalesContainer).toBeInTheDocument();
    });

    it('should render 5M as the initial time scale', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        const timeScale = screen.getByTestId('5M');
        expect(timeScale).toBeInTheDocument();
        expect(timeScale).toHaveClass('bg-starBlue');
    });

    it('should change time scale when selected', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
        });
        const initialTimeScale = screen.getByTestId('5M');
        expect(initialTimeScale).toBeInTheDocument();
        expect(initialTimeScale).toHaveClass('bg-starBlue');

        const selectedTimeScale = screen.getByTestId('1H');
        fireEvent.click(selectedTimeScale);
        expect(selectedTimeScale).toHaveClass('bg-starBlue');
        expect(initialTimeScale).not.toHaveClass('bg-starBlue');
    });

    it.each([
        ['1W', HistoricalDataIntervals['1D']],
        ['1MTH', HistoricalDataIntervals['1D']],
        ['1H', HistoricalDataIntervals['1H']],
    ])(
        'should use correct query interval when %s is selected',
        async (testId, expectedInterval) => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            });
            fireEvent.click(screen.getByTestId(testId));

            await waitFor(() => {
                const lastCall =
                    mockedUseGraphClientHook.mock.calls[
                        mockedUseGraphClientHook.mock.calls.length - 1
                    ];
                expect(lastCall[0]).toMatchObject({
                    interval: expectedInterval,
                });
            });
        }
    );
});
