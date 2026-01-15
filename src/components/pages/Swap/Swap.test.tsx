import { composeStories } from '@storybook/react';
import { render, waitFor } from 'src/test-utils.js';
import * as stories from './Swap.stories';

const { Default } = composeStories(stories);

describe('Swap Component', () => {
    it('should render a Swap', async () => {
        await waitFor(() => render(<Default />));
    });
});
