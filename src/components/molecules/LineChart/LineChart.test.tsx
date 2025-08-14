import { composeStories } from '@storybook/react';
import { queries, render, RenderResult, waitFor } from 'src/test-utils.js';
import * as stories from './LineChart.stories';

const { Default } = composeStories(stories);

describe('LineChart Component', () => {
    it.skip('should render a LineChart', async () => {
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
