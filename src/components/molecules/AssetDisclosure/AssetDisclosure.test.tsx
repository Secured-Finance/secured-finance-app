import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './AssetDisclosure.stories';

const { Default, Ledger } = composeStories(stories);

describe('test AssetDisclosure component', () => {
    it('should render only button of AssetDisclosure', () => {
        render(<Default />);
        expect(screen.getByText('Asset')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
        expect(screen.queryByText('Asset')).not.toBeInTheDocument();
    });

    it('should open and display assets by default', () => {
        render(<Default />);
        expect(screen.getByText('Asset')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Ether')).toBeInTheDocument();
        expect(screen.getByText('1.200')).toBeInTheDocument();
        expect(screen.getAllByText('USDC')).toHaveLength(2);
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should close assets on button click', async () => {
        render(<Default />);
        await waitFor(() => {
            expect(screen.getByText('Asset')).toBeInTheDocument();
            expect(screen.getByText('Balance')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.queryByText('Asset')).not.toBeInTheDocument();
            expect(screen.queryByText('Balance')).not.toBeInTheDocument();
        });
    });

    it('should format account depending on source metamask', () => {
        render(<Default />);
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
    });

    it('should format account depending on source ledger', () => {
        render(<Ledger />);
        expect(screen.getByText('de926db3012a...aa4f')).toBeInTheDocument();
    });
});
