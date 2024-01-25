import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './NetworkSelector.stories';

const { Default } = composeStories(stories);

describe('Network Selector component', () => {
    it('should render component with correct network', async () => {
        render(<Default networkName='sepolia' />);
        expect(screen.queryByText('Network')).not.toBeInTheDocument();
        const networkButton = await screen.findByRole('button');
        fireEvent.click(networkButton);
        expect(screen.queryByText('Network')).not.toBeInTheDocument();
        expect(await screen.findByText('Sepolia')).toBeInTheDocument();
    });

    it('should render component with unsupported network', async () => {
        render(<Default networkName='mainnet' />);
        expect(await screen.findByText('Network')).toBeInTheDocument();
        const networkButton = await screen.findByRole('button');
        fireEvent.click(networkButton);
        expect(await screen.findByText('Network')).toBeInTheDocument();
        expect(await screen.findByText('Sepolia')).toBeInTheDocument();
    });
});
