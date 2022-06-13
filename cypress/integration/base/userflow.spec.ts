import { tenderlyConfig } from 'support/utils/tenderlyConfig';

describe('A user connecting to the app', () => {
    tenderlyConfig();

    it('should be able to connect is wallet for the first time', () => {
        cy.get('[data-cy="wallet-address"]')
            .should('have.length', 2)
            .then(walletAddress => {
                chai.expect(walletAddress[0].textContent).to.not.be.equal(
                    '...',
                    'Ethereum wallet address should not be empty'
                );
            });
        cy.get('[data-cy="manage-collateral-chip"]').click();
        cy.contains('Register').click().wait(5000);
    });
});
