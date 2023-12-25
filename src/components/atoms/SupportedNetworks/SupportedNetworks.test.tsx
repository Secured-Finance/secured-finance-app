import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './SupportedNetworks.stories';

const { Default } = composeStories(stories);

describe('SupportedNetworks Component', () => {
    it('should render a SupportedNetworks', () => {
        render(<Default />);
        expect(screen.getByText('Sepolia')).toBeInTheDocument();
    });
});
