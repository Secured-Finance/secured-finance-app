import { composeStories } from '@storybook/testing-react';
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
        expect(screen.getByText('Wrapped Bitcoin')).toBeInTheDocument();
    });

    it('should change the value of selected option when rerendered with a different selected option', () => {
        render(<AssetDropdown />);
        expect(screen.getByText('Wrapped Bitcoin')).toBeInTheDocument();
        render(
            <AssetDropdown selected={{ label: 'Ethereum', value: 'ETH' }} />
        );
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should have an arrow down when the dropdown is not visible, and an arrow down when the dropdown is visible', () => {
        render(<AssetDropdown />);
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('chevron-down-icon')).toHaveClass(
            'rotate-180'
        );
    });

    it('should change the button when a dropdown item is selected', () => {
        render(<AssetDropdown />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(screen.getByRole('button')).toHaveTextContent('Ethereum');
    });

    it('should render a term selector', () => {
        render(<TermDropdown />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should call onChange function when a dropdown item is selected with the value of the option', () => {
        const onChange = jest.fn();
        render(<AssetDropdown onChange={onChange} />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(onChange).toHaveBeenLastCalledWith('ETH');
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('should call onChange function with the initial value', () => {
        const onChange = jest.fn();
        render(<AssetDropdown onChange={onChange} />);
        expect(onChange).toHaveBeenLastCalledWith('WBTC');
    });

    it('should render different button for variant nolabel', () => {
        render(<NoLabel />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });
});
