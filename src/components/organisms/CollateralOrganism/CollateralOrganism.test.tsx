import { composeStories } from '@storybook/testing-react';
import { queries, render, RenderResult, waitFor } from 'src/test-utils.js';
import * as stories from './CollateralOrganism.stories';

const { Default } = composeStories(stories);

describe('CollateralOrganism Component', () => {
    it('should render CollateralOrganism', async () => {
        let ag: RenderResult<typeof queries, HTMLElement>;
        await waitFor(() => {
            ag = render(<Default />);
        }).then(() => {
            expect(ag.baseElement).toMatchSnapshot();
        });
    });
});
