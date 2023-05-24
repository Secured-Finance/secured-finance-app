import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Counter.stories';

const { Default, OnlyNumber, OnlyPrefix, OnlySuffix } = composeStories(stories);

describe('test Counter component', () => {
    it('should render default counter', async () => {
        render(<Default />);
        await waitFor(
            () => expect(screen.getByText('$12.234M')).toBeInTheDocument(),
            {
                timeout: 3000,
            }
        );
    });

    it('should render only number counter', async () => {
        render(<OnlyNumber />);
        await waitFor(
            () => expect(screen.getByText('14.23')).toBeInTheDocument(),
            {
                timeout: 3000,
            }
        );
    });

    it('should render only prefix counter', async () => {
        render(<OnlyPrefix />);
        await waitFor(
            () => expect(screen.getByText('$4,000.91')).toBeInTheDocument(),
            {
                timeout: 3000,
            }
        );
    });

    it('should render only suffix counter', async () => {
        render(<OnlySuffix />);
        await waitFor(
            () => expect(screen.getByText('40.2K')).toBeInTheDocument(),
            {
                timeout: 3000,
            }
        );
    });
});
