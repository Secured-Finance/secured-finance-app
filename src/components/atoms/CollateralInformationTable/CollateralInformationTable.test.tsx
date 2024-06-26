import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralInformationTable.stories';

const { Default } = composeStories(stories);

describe('test CollateralInformationTable component', () => {
    it('should render CollateralInformationTable', () => {
        render(<Default />);
        expect(screen.getByText('Asset')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Ether')).toBeInTheDocument();
        expect(screen.getByText('1.200')).toBeInTheDocument();
        expect(screen.getAllByText('USDC')).toHaveLength(2);
        expect(screen.getByText('100')).toBeInTheDocument();
    });
});
