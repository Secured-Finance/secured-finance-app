import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TableContractCell.stories';

const { Default, Compact, ContractOnly } = composeStories(stories);

describe('TableContractCell Component', () => {
    describe('Default Variant', () => {
        it('should display the name of the currency by default', () => {
            render(<Default />);
            expect(screen.getByText('Ether')).toBeInTheDocument();
        });

        it('should display the name of the contract with the currency', () => {
            render(<Default />);
            expect(screen.getByText('ETH-DEC22')).toBeInTheDocument();
        });

        it('should display a larger image by default', () => {
            render(<Default />);
            expect(screen.getByRole('img')).toHaveClass('w-6 h-6');
        });
    });

    describe('Compact Variant', () => {
        it('should not display the name of the currency in the compact variant', () => {
            render(<Compact />);
            expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
        });

        it('should display a smaller image in the compact variant', () => {
            render(<Compact />);
            expect(screen.getByRole('img')).toHaveClass('w-5 h-5');
        });
    });

    describe('Contract Only Variant', () => {
        it('should only display the contract name in the contract only variant', () => {
            render(<ContractOnly />);
            expect(screen.getByText('DEC22')).toBeInTheDocument();
            expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });
    });
});
