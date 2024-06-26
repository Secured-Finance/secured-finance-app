import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils';
import * as stories from './WithdrawPositionTable.stories';

const { Default } = composeStories(stories);

describe('WithdrawPositionTable Component', () => {
    it('should render a WithdrawPositionTable', () => {
        render(<Default />);
        const withdrawPositionTable = screen.getByRole('table');
        expect(withdrawPositionTable).toBeInTheDocument();
    });

    it('should display the correct net value', () => {
        render(<Default />);
        expect(screen.getByText('$1,000')).toBeInTheDocument();
    });
});
