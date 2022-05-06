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
    // Selecting the first element of connect button. Not the best way to do it, but it works for now.
    cy.get('[data-cy="connect-button"]:first').click();
});

Cypress.Commands.add('clean', () => {
    config.after();
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
