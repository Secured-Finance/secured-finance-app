import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Timer.stories';

const { Default, WithText } = composeStories(stories);

describe('Timer Component', () => {
    it('should render a Timer', async () => {
        render(<Default />);
        expect(screen.getByText('0d 10h 0m 0s')).toBeInTheDocument();
        expect(screen.queryByText('Timer')).not.toBeInTheDocument();
    });

    it('should render text if available', async () => {
        render(<WithText />);
        expect(screen.getByText('0d 10h 0m 0s')).toBeInTheDocument();
        expect(screen.getByText('Timer')).toBeInTheDocument();
    });
});
