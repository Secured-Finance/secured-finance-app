import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './AssetInformation.stories';

const { Default } = composeStories(stories);

describe('test AssetInformation component', () => {
    it('should render AssetInformation', () => {
        render(<Default />);
        expect(screen.getByText('Collateral Assets')).toBeInTheDocument();
        expect(screen.getByText('FIL')).toBeInTheDocument();
        expect(screen.getByText('740 FIL')).toBeInTheDocument();
    });
});
