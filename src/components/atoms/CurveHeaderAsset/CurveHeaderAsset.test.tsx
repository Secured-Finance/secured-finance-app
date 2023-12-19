import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurveHeaderAsset.stories';

const { Default } = composeStories(stories);

describe('test CurveHeaderAsset component', () => {
    it('should render CurveHeaderAsset', () => {
        render(<Default />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
        expect(screen.getByText('$8.02')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
