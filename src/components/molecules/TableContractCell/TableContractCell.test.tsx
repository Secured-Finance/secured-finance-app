import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TableContractCell.stories';

const { Default, Compact } = composeStories(stories);

describe('TableContractCell Component', () => {
    it('should render a TableContractCell', () => {
        render(<Default />);
    });

    it('should display the name of the currency by default', () => {
        render(<Default />);
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should display the name of the contract with the currency', () => {
        render(<Default />);
        expect(screen.getByText('ETH-DEC22')).toBeInTheDocument();
    });

    it('should display a larger image by default', () => {
        render(<Default />);
        expect(screen.getByRole('img')).toHaveClass('w-6 h-6');
    });

    it('should not display the name of the currency in the compact variant', () => {
        render(<Compact />);
        expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });

    it('should display a smaller image in the compact variant', () => {
        render(<Compact />);
        expect(screen.getByRole('img')).toHaveClass('w-5 h-5');
    });
});
