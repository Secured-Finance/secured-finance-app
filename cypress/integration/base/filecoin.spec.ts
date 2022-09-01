/// <reference types="cypress" />
import { expectFilecoin, filecoin } from 'support/filecoin';
import { tenderlyConfig } from 'support/utils/tenderlyConfig';
import * as wallets from '../../fixtures/filecoin.json';

describe('Filecoin Wallet', () => {
    tenderlyConfig();

    beforeEach(() => {
        cy.get('[data-cy="popover-button"]').click();
        cy.get('[data-cy="add-filecoin-wallet"]').click();
    });

    it('should offer three choices when trying to connect', () => {
        cy.contains('PrivateKey').should('be.visible');
        cy.contains('Ledger').should('be.visible');
        cy.contains('Mnemonic').should('be.visible');
        cy.get('[data-testid="dialog-action-button"]').should('be.visible');
    });

    it('should connect to a new filecoin wallet when using mnemonic phrase and disconnect', () => {
        cy.get('[data-cy="mnemonic-radio-option"]').click();
        cy.get('[data-testid="dialog-action-button"]').click();
        cy.get('[data-cy="create-hd-wallet"]')
            .click()
            .then(() => {
                expectFilecoin.walletConnected();
            });
    });

    // This test is skipped as there is no way to disconnect a utility wallet
    // The test works by itself but does not work after the previous test
    it.skip('should connect to an existing account when importing an account with a mnemonic phrase', () => {
        filecoin.connectWallet(wallets.walletAlice);
    });
});
