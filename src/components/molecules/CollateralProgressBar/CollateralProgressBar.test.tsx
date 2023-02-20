import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CollateralProgressBar.stories';

const { Default, ConnectedToWallet } = composeStories(stories);

describe('CollateralProgressBar Component', () => {
    it('should render a default CollateralProgressBar', () => {
        render(<Default />);

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')).toHaveLength(2);

        expect(screen.getByTestId('collateral-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );
    });

    it('should render a CollateralProgressBar with values', () => {
        render(<ConnectedToWallet />);

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('$37.00')).toBeInTheDocument();
        expect(screen.getByText('of $74.00 available')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.queryByText('N/A')).not.toBeInTheDocument();

        expect(screen.getByTestId('collateral-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.37 + 4px )'
        );
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.37)'
        );

        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        const informationPopover = screen.getByTestId('information-popover');

        expect(informationPopover).toHaveTextContent(
            'Your total borrow limit is at $37.00 which is 74% of your $100.00 collateral deposit.Increasing collateral deposit will increase your borrow limit by 74% of its value.'
        );
    });
});
