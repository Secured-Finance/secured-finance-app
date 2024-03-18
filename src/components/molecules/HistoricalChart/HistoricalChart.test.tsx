import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './HistoricalChart.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('HistoricalChart component', () => {
    it('should render chart containers', () => {
        render(<Default />);

        expect(screen.getByTestId('candlestick-chart')).toBeInTheDocument();
        expect(screen.getByTestId('volume-chart')).toBeInTheDocument();
    });

    it('should render legend', () => {
        render(<Default />);

        expect(screen.getByText('Vol(USDT):')).toBeInTheDocument();
        expect(screen.getByText('O')).toBeInTheDocument();
        expect(screen.getByText('H')).toBeInTheDocument();
        expect(screen.getByText('L')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
        expect(screen.getByText('Change')).toBeInTheDocument();
    });

    it('should call getHistoricalData with correct params when mounted', async () => {
        const { store } = await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            })
        );
        expect(store.getState().landingOrderForm.maturity).toEqual(1669852800);
        expect(store.getState().landingOrderForm.currency).toEqual('WFIL');
    });

    it('should match snapshot', () => {
        const { container } = render(<Default />);
        expect(container).toMatchSnapshot();
    });
});
