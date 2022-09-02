type Wallet = {
    address: string;
    phrase: string;
};

export const expectFilecoin = {
    walletConnected: () => {
        cy.wait(1000).then(() => {
            cy.get('[data-cy="history"]').click();
            cy.get('[data-cy="utilwallet-disclosure-button"]').should(
                'be.visible'
            );
            chai.expect(localStorage.getItem('FIL_WALLET_TYPE')).to.be.not.null;
            chai.expect(localStorage.getItem('FIL_ADDRESS')).to.be.not.null;
        });
    },
    walletNotConnected: () => {
        cy.get('[data-cy="history"]').click();
        cy.get('[data-cy="utilwallet-disclosure-button"]').should(
            'not.be.visible'
        );
        chai.expect(localStorage.getItem('FIL_WALLET_TYPE')).to.not.exist;
        chai.expect(localStorage.getItem('FIL_ADDRESS')).to.not.exist;
    },
    connectedWallet: (address: string) => {
        cy.get('[data-cy="filecoin-settings-chip"]').click();
        cy.get('[data-cy="modal-wallet-address"]').contains(address);
        cy.get('button:contains("Close")').click();
    },
};

export const filecoin = {
    connectWallet: (wallet: Wallet) => {
        cy.get('[data-cy="privatekey-radio-option"]').click();
        cy.get('[data-testid="dialog-action-button"]').click();
        cy.get('[aria-label="Private Key"]').click();
        //TODO: replace this selector once the buttons are reorganized
        cy.get(
            'button:contains("Mnemonic"):not(:contains("Generate"))'
        ).click();
        cy.get('#mnemonic-input').type(wallet.phrase);
        cy.get('[data-cy="address"]').contains(wallet.address);
        cy.get('[data-cy="import-mnemonic-button"]')
            .click()
            .then(() => {
                expectFilecoin.walletConnected();
            });
    },
};
