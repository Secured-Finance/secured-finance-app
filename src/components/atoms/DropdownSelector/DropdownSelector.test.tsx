import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './DropdownSelector.stories';

const { AssetDropdown, TermDropdown, NoLabel } = composeStories(stories);

describe('Dropdown Asset Selection Component', () => {
    it('should render', () => {
        render(<AssetDropdown />);
    });

    it('should render a clickable button', () => {
        render(<AssetDropdown />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render a dropdown', () => {
        render(<AssetDropdown />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should render a dropdown with the value prop as the selected default option', () => {
        render(<AssetDropdown />);
        expect(screen.getByText('WBTC')).toBeInTheDocument();
    });

    it('should change the value of selected option when rerendered with a different selected option', () => {
        render(<AssetDropdown />);
        expect(screen.getByText('WBTC')).toBeInTheDocument();
        render(<AssetDropdown selected={{ label: 'ETH', value: 'ETH' }} />);
        expect(screen.getByText('ETH')).toBeInTheDocument();
    });

    it('should have an arrow down when the dropdown is not visible, and an arrow down when the dropdown is visible', () => {
        render(<AssetDropdown />);
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('chevron-down-icon')).toHaveClass(
            'rotate-180',
        );
    });

    it('should change the button when a dropdown item is selected', () => {
        render(<AssetDropdown />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('ETH'));
        expect(screen.getByRole('button')).toHaveTextContent('ETH');
    });

    it('should render a term selector', () => {
        render(<TermDropdown />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    describe('onChange behaviors', () => {
        it('should call onChange function with the initial value', () => {
            const onChange = jest.fn();
            render(<AssetDropdown onChange={onChange} />);
            expect(onChange).toHaveBeenLastCalledWith('WBTC');
        });

        it('should call onChange function when a dropdown item is selected with the value of the option', () => {
            const onChange = jest.fn();
            render(<AssetDropdown onChange={onChange} />);
            expect(onChange).toHaveBeenNthCalledWith(1, 'WBTC');
            fireEvent.click(screen.getByRole('button'));
            fireEvent.click(screen.getByText('ETH'));
            expect(onChange).toHaveBeenNthCalledWith(2, 'ETH');
            fireEvent.click(screen.getByRole('button'));
            fireEvent.click(screen.getByText('WFIL'));
            expect(onChange).toHaveBeenNthCalledWith(3, 'WFIL');
            fireEvent.click(screen.getByRole('button'));
            fireEvent.click(screen.getByText('WBTC'));
            expect(onChange).toHaveBeenNthCalledWith(4, 'WBTC');
        });

        it('should call onChange function only when the value is changed', () => {
            const onChange = jest.fn();
            render(<AssetDropdown onChange={onChange} />);
            expect(onChange).toHaveBeenNthCalledWith(1, 'WBTC');
            fireEvent.click(screen.getByRole('button'));
            fireEvent.click(screen.getAllByText('WBTC')[1]);
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it('should not call onChange function when rerendering with the same selected value', () => {
            const onChange = jest.fn();
            const { rerender } = render(<AssetDropdown onChange={onChange} />);
            expect(onChange).toHaveBeenCalledTimes(1);

            rerender(<AssetDropdown onChange={onChange} />);
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it('should call onChange function when rerendering with a different selected value', () => {
            const onChange = jest.fn();
            const { rerender } = render(<AssetDropdown onChange={onChange} />);
            expect(onChange).toHaveBeenNthCalledWith(1, 'WBTC');

            rerender(
                <AssetDropdown
                    onChange={onChange}
                    selected={{ label: 'ETH', value: 'ETH' }}
                />,
            );
            expect(onChange).toHaveBeenNthCalledWith(2, 'ETH');
            expect(onChange).toHaveBeenCalledTimes(2);
        });
    });

    it('should render different button for variant nolabel', () => {
        render(<NoLabel />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('ETH'));
        expect(screen.queryByText('ETH')).not.toBeInTheDocument();
    });

    it('should render a full width button and options for fullWidth variant', () => {
        render(<AssetDropdown variant='fullWidth' />);
        expect(screen.getByRole('button')).toHaveClass('w-full');
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toHaveClass('w-full');
    });
});
