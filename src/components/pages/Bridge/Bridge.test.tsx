import { composeStories } from '@storybook/react';
import { render, waitFor } from 'src/test-utils.js';
import * as stories from './Bridge.stories';

const { Default } = composeStories(stories);

describe('Bridge Component', () => {
    it('should render a Bridge', async () => {
        await waitFor(() => render(<Default />));
    });
});
