type wallet = {
    address: string;
    phrase: string;
};

export const expectFilecoin = {
    walletConnected: () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').should('not.exist');
        cy.get('[data-cy="filecoin-settings-chip"]').should('be.visible');
        chai.expect(localStorage.getItem('FIL_WALLET_TYPE')).to.be.not.null;
        chai.expect(localStorage.getItem('FIL_ADDRESS')).to.be.not.null;
    },
    walletNotConnected: () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').should('be.visible');
        cy.get('[data-cy="filecoin-settings-chip"]').should('not.exist');
        chai.expect(localStorage.getItem('FIL_WALLET_TYPE')).to.not.exist;
        chai.expect(localStorage.getItem('FIL_ADDRESS')).to.not.exist;
    },
    connectedWallet: (address: string) => {
        cy.get('[data-cy="filecoin-settings-chip"]').click();
        cy.get('[data-cy="modal-wallet-address"]').contains(address);
        cy.get('[data-cy="close-button"]').click();
    },
};

export const filecoin = {
    connectWallet: (wallet: wallet) => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').click();
        cy.get('[data-cy="import-button"]').click();
        //TODO: replace this selector once the buttons are reorganized
        cy.get(
            'button:contains("Mnemonic"):not(:contains("Generate"))'
        ).click();
        cy.get('#mnemonic-input').type(wallet.phrase);
        cy.get('[data-cy="address"]').contains(wallet.address);
        cy.get('[data-cy="import-button"]')
            .click()
            .then(() => {
                expectFilecoin.walletConnected();
            })
            .then(() => {
                expectFilecoin.connectedWallet(wallet.address);
            });
    },
    disconnectWallet: () => {
        cy.get('[data-cy="filecoin-settings-chip"]').click();
        cy.get('[data-cy="sign-out-button"]').click();

        cy.get('[data-cy="wallet"]')
            .click()
            .then(() => {
                expectFilecoin.walletNotConnected();
            });
    },
};
