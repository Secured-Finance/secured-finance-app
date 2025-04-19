import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MultiLineChartTab.stories';

jest.mock('dom-to-image', () => ({
    toPng: jest.fn().mockResolvedValue('data:image/png;base64,mockImageData'),
}));

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

const { Default } = composeStories(stories);

describe('MultiLineChartTab Component', () => {
    beforeAll(() => {
        global.URL.createObjectURL = jest.fn(() => 'mocked-data-url');
    });

    it('renders the MultiLineChartTab component', () => {
        render(<Default />);
        expect(screen.getByTestId('handleDownloadBtn')).toBeInTheDocument();
    });

    it('toggles maximize state and renders maximized content', async () => {
        render(<Default />);
        const maximizeBtn = screen.getByTestId('toggleMaximize');
        await userEvent.click(maximizeBtn);

        expect(screen.queryByText('Yield Spread')).not.toBeInTheDocument();
    });

    it('handles download button click', async () => {
        const mockLinkClick = jest.fn();
        const originalCreateElement = document.createElement.bind(document);

        jest.spyOn(document, 'createElement').mockImplementation(
            (tag: string): HTMLElement => {
                if (tag === 'a') {
                    const anchor = originalCreateElement(
                        'a'
                    ) as HTMLAnchorElement;
                    anchor.click = mockLinkClick;
                    return anchor;
                }
                return originalCreateElement(tag);
            }
        );

        render(<Default />);
        const downloadBtn = screen.getByTestId('handleDownloadBtn');
        expect(downloadBtn).toBeInTheDocument();
        await userEvent.click(downloadBtn);

        await waitFor(() => {
            expect(mockLinkClick).toHaveBeenCalled();
        });

        jest.restoreAllMocks();
    });
    afterAll(() => {
        global.URL.createObjectURL = jest.fn();
    });
});
