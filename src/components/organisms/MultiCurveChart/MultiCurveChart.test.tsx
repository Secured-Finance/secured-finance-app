import { composeStories } from '@storybook/testing-react';
import { queries, render, RenderResult, waitFor } from 'src/test-utils.js';
import * as stories from './MultiCurveChart.stories';

const { Default } = composeStories(stories);

describe('MultiCurveChart Component', () => {
    it('should render a MultiCurveChart', () => {
        render(<Default />);
    });

    it('should render a match the snapshot', async () => {
        let ag: RenderResult<typeof queries, HTMLElement>;
        await waitFor(() => {
            ag = render(<Default />);
        }).then(() => {
            expect(
                ag.container
                    .querySelector('canvas')
                    ?.getContext('2d')
                    ?.__getEvents()
            ).toMatchSnapshot();
        });
    });
});
