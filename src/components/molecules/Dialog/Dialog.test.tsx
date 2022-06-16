import { fireEvent, render, screen } from 'src/test-utils.js';
import { Dialog } from './Dialog';

describe('Dialog component', () => {
    it('should render a dialog if isOpen', () => {
        const onClick = jest.fn();
        const onClose = jest.fn();
        render(
            <Dialog
                isOpen={true}
                onClose={onClose}
                title='This is the title'
                description='This is a great description, usually this is a longer text'
                callToAction='Do Something'
                onClick={onClick}
            >
                <p style={{ color: 'white' }}>
                    This is the content but since it is a component, it can be
                    styled as we want
                </p>
            </Dialog>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('This is the title')).toBeInTheDocument();
        expect(
            screen.getByText(
                'This is a great description, usually this is a longer text'
            )
        ).toBeInTheDocument();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Do Something');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });
});
