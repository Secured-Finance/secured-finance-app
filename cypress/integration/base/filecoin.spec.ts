/// <reference types="cypress" />
import * as filecoin from '../../fixtures/filecoin.json';

describe('Filecoin Wallet', () => {
    const assertFilecoinWalletNotConnected = () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').should('be.visible');
        cy.get('[data-cy="filecoin-settings-chip"]').should('not.exist');
        chai.expect(localStorage.getItem('FIL_WALLET_TYPE')).to.not.exist;
        chai.expect(localStorage.getItem('FIL_ADDRESS')).to.not.exist;
    };

    const assertFilecoinWalletConnected = () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').should('not.exist');
        cy.get('[data-cy="filecoin-settings-chip"]').should('be.visible');
        chai.expect(localStorage.getItem('FIL_WALLET_TYPE')).to.be.not.null;
        chai.expect(localStorage.getItem('FIL_ADDRESS')).to.be.not.null;
    };

    const checkConnectedWallet = (address: string) => {
        cy.get('[data-cy="filecoin-settings-chip"]').click();
        cy.get('[data-cy="modal-wallet-address"]').contains(address);

        cy.get('[data-cy="close-button"]').click();
    };

    beforeEach(() => {
        cy.connectWallet().then(() => {
            assertFilecoinWalletNotConnected();
        });
    });

    it('should offer three choices when trying to connect', () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').click();
        cy.contains('Select a wallet provider').should('be.visible');
        cy.contains('Private Key').should('be.visible');
        cy.contains('Ledger wallet').should('be.visible');
        cy.contains('Mnemonic phrase').should('be.visible');
        cy.get('[data-cy="cancel-button"]').should('be.visible').click();
    });

    it('should connect to a new filecoin wallet when using mnemonic phrase and disconnect', () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').click();
        cy.get('[data-cy="generate-button"]').click();
        cy.get('[data-cy="save-button"]')
            .click()
            .then(() => {
                assertFilecoinWalletConnected();
            });

        cy.get('[data-cy="wallet-address"]')
            .should('have.length', 2)
            .and(walletAddress => {
                chai.expect(walletAddress[0].textContent).to.be.equal('...');
                chai.expect(walletAddress[1].textContent).to.be.equal('...');
            });

        cy.get('[data-cy="filecoin-settings-chip"]').click();
        cy.get('[data-cy="sign-out-button"]').click();

        cy.get('[data-cy="wallet"]')
            .click()
            .then(() => {
                assertFilecoinWalletNotConnected();
            });
    });

    it('should connect to an existing account when importing an account with a mnemonic phrase', () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').click();
        cy.get('[data-cy="import-button"]').click();
        //TODO: replace this selector once the buttons are reorganized
        cy.get(
            'button:contains("Mnemonic"):not(:contains("Generate"))'
        ).click();
        cy.get('#mnemonic-input').type(filecoin.phrase);
        cy.get('[data-cy="address"]').contains(filecoin.wallet);
        cy.get('[data-cy="import-button"]')
            .click()
            .then(() => {
                assertFilecoinWalletConnected();
            })
            .then(() => {
                checkConnectedWallet(filecoin.wallet);
            });
    });
});
