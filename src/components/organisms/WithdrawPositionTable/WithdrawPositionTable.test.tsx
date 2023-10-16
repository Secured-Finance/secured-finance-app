import { composeStories } from '@storybook/react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils';
import * as stories from './WithdrawPositionTable.stories';

const { Default } = composeStories(stories);

const preloadedState = { ...preloadedAssetPrices };

describe('WithdrawPositionTable Component', () => {
    it('should render a WithdrawPositionTable', () => {
        render(<Default />);
        const withdrawPositionTable = screen.getByRole('table');
        expect(withdrawPositionTable).toBeInTheDocument();
    });

    it('should display the correct net value', () => {
        render(<Default />, { preloadedState });
        expect(screen.getByText('($972,770)')).toBeInTheDocument();
    });
});
