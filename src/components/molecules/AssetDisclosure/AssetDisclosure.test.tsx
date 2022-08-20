import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './AssetDisclosure.stories';

const { Default } = composeStories(stories);

describe('test AssetDisclosure component', () => {
    it('should render only button of AssetDisclosure', () => {
        render(<Default />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
        expect(screen.queryByText('Asset')).not.toBeInTheDocument();
    });

    it('should open and display assets on button click', () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Asset')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('1.2 ETH')).toBeInTheDocument();
        expect(screen.getAllByText('USDC')).toHaveLength(2);
        expect(screen.getByText('100 USDC')).toBeInTheDocument();
    });

    it('should open and close assets on button click', () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Asset')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button'));
        expect(screen.queryByText('Asset')).not.toBeInTheDocument();
        expect(screen.queryByText('Balance')).not.toBeInTheDocument();
    });
});
