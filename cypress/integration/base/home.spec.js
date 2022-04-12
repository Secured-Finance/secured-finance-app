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
});
