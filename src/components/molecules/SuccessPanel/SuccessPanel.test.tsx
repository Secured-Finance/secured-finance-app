import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './SuccessPanel.stories';

const { Default, WithTransactionHash } = composeStories(stories);

global.open = jest.fn();

describe('SuccessPanel Component', () => {
    it('should render a SuccessPanel', () => {
        render(<Default />);
    });

    it('should not have link to etherscan if txHash is not provided', () => {
        render(<Default />);
        const address = screen.getByText('987654321123456789');
        expect(address).toBeInTheDocument();
        expect(address.tagName).not.toBe('BUTTON');
    });

    it('should have a link to etherscan if txHash is provided', () => {
        render(<WithTransactionHash />);
        const address = screen.getByText('987654321123456789');
        expect(address).toBeInTheDocument();
        expect(address.tagName).toBe('BUTTON');
        address.click();

        // Assert that window.open was called with the expected URL
        expect(global.open).toHaveBeenCalledWith(
            'https://unknown.etherscan.io/tx/1123456789',
            '_blank'
        );
    });
});
