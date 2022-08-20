import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralInformationTable.stories';

const { Default } = composeStories(stories);

describe('test CollateralInformationTable component', () => {
    it('should render CollateralInformationTable', () => {
        render(<Default />);
        expect(screen.getByText('Asset')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('1.2 ETH')).toBeInTheDocument();
        expect(screen.getAllByText('USDC')).toHaveLength(2);
        expect(screen.getByText('100 USDC')).toBeInTheDocument();
    });
});
