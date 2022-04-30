/// <reference types="cypress" />

describe('The Home Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('displays the header with the links and the lending page', () => {
        cy.get('[data-cy="header"]').should('be.visible');
        cy.get('[data-cy="lending"]').should('be.visible');
        cy.get('[data-cy="terminal"]').should('be.visible');
        cy.get('[data-cy="history"]').should('be.visible');
        cy.get('[data-cy="wallet"]').should('be.visible');
        cy.get('[data-cy="lending-page"]').should('be.visible');
    });

    it('can follow links on header buttons', () => {
        cy.get('[data-cy="terminal"]').click();
        cy.url().should('include', '/exchange');
        cy.get('[data-cy="exchange-page"]').should('be.visible');

        cy.get('[data-cy="lending"]').click();
        cy.get('[data-cy="lending-page"]').should('be.visible');
    });

    it('display two wallet providers when clicking unlocking wallet', () => {
        cy.get('[data-cy="wallet"]').click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="eth-wallet"]').should('be.visible');

        cy.get('[data-cy="connect-button"]')
            .should('have.length', 2)
            .and(buttonList => {
                chai.expect(
                    buttonList.get(0).textContent,
                    'metamask button'
                ).to.be.equal('Connect');
                chai.expect(
                    buttonList.get(1).textContent,
                    'other button'
                ).to.be.equal('Connect');
            })
            .and(buttonList => {
                buttonList.get(0).click();
            });
    });
});
