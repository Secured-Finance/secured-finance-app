import { render, screen } from 'src/test-utils.js';
import { composeStories } from '@storybook/testing-react';
import * as stories from './CurveHeaderAsset.stories';

const { Default } = composeStories(stories);

describe('test CurveHeaderAsset component', () => {
    it('should render CurveHeaderAsset', () => {
        render(<Default />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
        expect(screen.getByText('$8.00')).toBeInTheDocument();
        expect(screen.getByText('-2.45%')).toBeInTheDocument();
    });
});
