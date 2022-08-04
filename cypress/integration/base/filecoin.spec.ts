/// <reference types="cypress" />
import { expectFilecoin, filecoin } from 'support/filecoin';
import { expectSendModal } from 'support/sendModal';
import { tenderlyConfig } from 'support/utils/tenderlyConfig';
import * as wallets from '../../fixtures/filecoin.json';

describe.skip('Filecoin Wallet', () => {
    tenderlyConfig();

    beforeEach(() => {
        cy.get('[data-cy="popover-button"]').click();
        cy.get('[data-cy="add-filecoin-wallet"]').click();
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
        cy.get('[data-cy="mnemonic-phrase-button"]').click();
        cy.get('[data-cy="create-hd-wallet"]')
            .click()
            .then(() => {
                expectFilecoin.walletConnected();
            });

        cy.get('[data-cy="old-wallet-address"]')
            .should('have.length', 2)
            .then(walletAddress => {
                chai.expect(walletAddress[0].textContent).to.not.be.equal(
                    '...',
                    'Ethereum wallet address should not be empty'
                );
                chai.expect(walletAddress[1].textContent).to.not.be.equal(
                    '...',
                    'Filecoin wallet address should not be empty'
                );
            });

        cy.get('[data-cy="filecoin-settings-chip"]').click();
        cy.get('[data-cy="modal-sign-out-button"]').click();
        expectFilecoin.walletNotConnected();
    });

    it('should connect to an existing account when importing an account with a mnemonic phrase', () => {
        filecoin.connectWallet(wallets.walletAlice);
        filecoin.disconnectWallet();
    });

    it('should transfer FIL to an existing account', () => {
        filecoin.connectWallet(wallets.walletBob);
        cy.get('[data-cy="filecoin-send-chip"]')
            .click()
            .then(() => {
                expectSendModal.displayCurrency('FIL');
            });
        cy.get('[data-cy="send-address-input"]').type(
            wallets.walletCharlie.address
        );
        cy.get('[data-cy="send-amount-input"]').type('1');
        cy.get('[data-cy="send-button"]')
            .should('not.be.disabled')
            .wait(2000)
            .click()
            .then(() =>
                cy
                    .get('[data-cy="settlement-validation"]')
                    .contains('Waiting for confirmation...')
            );
        cy.get('body').click(0, 0);
    });
});
