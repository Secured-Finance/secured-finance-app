import { composeStories } from '@storybook/react';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './StatsBox.stories';

const { Default } = composeStories(stories);

describe('test StatsBox component', () => {
    it('should render Stats Box', async () => {
        render(<Default />);
        expect(screen.getByText('Net APR')).toBeInTheDocument();
        await waitFor(
            () => expect(screen.getByText('$8.02')).toBeInTheDocument(),
            {
                timeout: 3000,
            }
        );
    });
});
