import { tradingData } from 'src/stories/mocks/historicalchart';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HistoricalChart.stories';

const { Default } = stories;

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('HistoricalChart', () => {
    it('should render chart containers', () => {
        render(<Default data={tradingData} />);

        expect(screen.getByTestId('candlestick-chart')).toBeInTheDocument();
        expect(screen.getByTestId('volume-chart')).toBeInTheDocument();
    });

    it('should render legend', () => {
        render(<Default data={tradingData} />);

        expect(screen.getByText('Vol(USDT):')).toBeInTheDocument();
        expect(screen.getByText('O')).toBeInTheDocument();
        expect(screen.getByText('H')).toBeInTheDocument();
        expect(screen.getByText('L')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
        expect(screen.getByText('Change')).toBeInTheDocument();
    });
});
