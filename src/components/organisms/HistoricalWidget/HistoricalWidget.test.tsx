import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './HistoricalWidget.stories';

const { Default } = composeStories(stories);

describe('HistoricalWidget', () => {
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
});
