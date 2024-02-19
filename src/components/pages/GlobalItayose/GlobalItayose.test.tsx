import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './GlobalItayose.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('GlobalItayose Component', () => {
    it('should render a GlobalItayose', () => {
        render(<Default />);
    });

    it('should show a link to the fair price discovery page', () => {
        render(<Default />);
        expect(
            screen.getByRole('link', { name: 'Secured Finance Docs' })
        ).toHaveAttribute(
            'href',
            'https://docs.secured.finance/platform-guide/unique-features/fair-price-discovery/'
        );
    });
});
