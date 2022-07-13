// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
Cypress.Commands.add('connectWallet', onBeforeLoad => {
    cy.visit('/', { onBeforeLoad: onBeforeLoad });
    cy.get('[data-cy="wallet"]').click();
    cy.get('[data-cy="metamask-radio-option"]').click();
    cy.get('[data-testid="dialog-action-button"]').click();
    cy.wait(1000);
    cy.get('[data-testid="close-button"]').click();
});

Cypress.Commands.add('disconnectWallet', () => {
    cy.get('[data-cy="popover-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="disconnect-wallet"]').click();
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // we expect a 3rd party library error with message 'list not defined'
    // and don't want to fail the test so we return false
    if (err.message.includes('checkRegisteredUser')) {
        return false;
    }
    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
});

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
