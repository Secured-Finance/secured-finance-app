import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);
const renderDefault = async () => {
    await waitFor(() =>
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
            preloadedState: {
                ...preloadedAssetPrices,
            },
        })
    );
};

describe('CurveHeader component', () => {
    it('should render CurveHeader', async () => {
        await renderDefault();
    });

    it('should display the full name of the asset', async () => {
        await renderDefault();
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should display the price of the asset', async () => {
        await renderDefault();
        expect(screen.getByText('$6.00')).toBeInTheDocument();
    });

    it('should display the change of the asset and round up the second decimal', async () => {
        await renderDefault();
        expect(screen.getByText('-8.21%')).toBeInTheDocument();
    });
});
