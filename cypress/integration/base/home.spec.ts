/// <reference types="cypress" />

describe.skip('The Home Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('displays the header with the links and the lending page', () => {
        cy.get('[data-cy="header"]').should('be.visible');
        cy.get('[data-cy="lending"]').should('be.visible');
        cy.get('[data-cy="terminal"]').should('be.visible');
        cy.get('[data-cy="history"]').should('be.visible');
        cy.get('[data-cy="wallet"]').should('be.visible');
        cy.get('[data-testid="lending-page"]').should('be.visible');
    });

    it.skip('can follow links on header buttons', () => {
        cy.get('[data-cy="terminal"]').click();
        cy.url().should('include', '/dashboard');
        cy.get('[data-testid="dashboard-page"]').should('be.visible');

        cy.get('[data-cy="lending"]').click();
        cy.get('[data-testid="lending-page"]').should('be.visible');
    });

    it.skip('display one wallet provider when clicking unlocking wallet', () => {
        cy.get('[data-cy="wallet"]').click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="radio-group"]').should('be.visible');

        cy.get('[data-cy="radio-group"]')
            .children()
            .should('have.length', 1)
            .and(radioList => {
                chai.expect(
                    radioList.get(0).textContent,
                    'Metamask button'
                ).to.be.equal('Metamask');
            })
            .and(radioList => {
                radioList.get(0).click();
            });

        cy.get('[data-testid="dialog-action-button"]')
            .should('be.visible')
            .click();
    });
});
