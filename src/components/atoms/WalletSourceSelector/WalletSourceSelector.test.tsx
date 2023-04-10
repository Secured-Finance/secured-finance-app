import { WalletSource } from '@secured-finance/sf-client/dist/secured-finance-client';
import { composeStories } from '@storybook/testing-react';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import MetamaskIcon from 'src/assets/img/metamask-fox.svg';
import { fireEvent, render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import { WalletSourceOption } from './WalletSourceSelector';
import * as stories from './WalletSourceSelector.stories';

const { Default } = composeStories(stories);

const walletSourceList: WalletSourceOption[] = [
    {
        source: WalletSource.METAMASK,
        available: 1000,
        asset: CurrencySymbol.WBTC,
        iconSVG: MetamaskIcon,
    },
    {
        source: WalletSource.SF_VAULT,
        available: 0,
        asset: CurrencySymbol.WBTC,
        iconSVG: SFLogoSmall,
    },
];

describe('WalletSourceSelector component', () => {
    it('should render WalletSourceSelector', () => {
        render(<Default />);
        expect(screen.getByText('Lending Source')).toBeInTheDocument();
        expect(screen.getByText('Available to Lend')).toBeInTheDocument();
        expect(screen.getByText('0xb98b...fd6d')).toBeInTheDocument();
        expect(screen.getByText('1,000 WBTC')).toBeInTheDocument();
    });

    it('should render a clickable button', () => {
        render(<Default />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render a dropdown', () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should change the button when a dropdown item is selected', () => {
        const onChange = jest.fn();
        render(<Default onChange={onChange} />);

        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith(WalletSource.METAMASK);

        fireEvent.click(screen.getByTestId('wallet-source-selector-button'));
        fireEvent.click(screen.getByTestId('option-1'));
        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        expect(screen.getByText('4,000 WBTC')).toBeInTheDocument();

        expect(onChange).toBeCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith(WalletSource.SF_VAULT);
    });

    it('should not render options which have zero balance except metamask', () => {
        render(<Default optionList={walletSourceList} />);
        expect(screen.getByText('0xb98b...fd6d')).toBeInTheDocument();
        expect(screen.getByText('1,000 WBTC')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('wallet-source-selector-button'));
        expect(screen.queryByTestId('option-1')).not.toBeInTheDocument();
    });
});
