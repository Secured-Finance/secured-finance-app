import { Button } from './Buttons';
import { render, screen } from 'src/test-utils.js';

describe('test Button component', () => {
    it('Should render button with a text', () => {
        render(<Button>Send</Button>);
        expect(screen.getByText(/send/i)).toBeInTheDocument();
    });
});
