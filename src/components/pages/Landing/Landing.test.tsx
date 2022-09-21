import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Landing.stories';

const { Default } = composeStories(stories);

describe('Landing Component', () => {
    it('should render a Landing', () => {
        render(<Default />);
    });

    it('should change the rate when the user changes the maturity', () => {
        render(<Default />);
        waitFor(() => {
            expect(screen.getByTestId('rate')).toHaveTextContent('1%');
        });

        waitFor(() => {
            fireEvent.click(screen.getByText('MAR22'));
            fireEvent.click(screen.getByText('DEC22'));
        });

        waitFor(() => {
            expect(screen.getByTestId('rate')).toHaveTextContent('2%');
        });
    });
});
