import { render, screen } from 'src/test-utils.js';
import { Button } from '.';

describe('test Button component', () => {
    it('should render button with a text', () => {
        render(<Button>Hello</Button>);
        expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    });

    it('should render as an anchor when used with a href', () => {
        render(<Button href='https://google.com'>Hello</Button>);

        const button = screen.getByRole('link');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', 'https://google.com');
        expect(button).toHaveTextContent('Hello');
    });

    it('should render as a button by default', () => {
        render(<Button variant='outlined'>Hello</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Hello');
    });
});
