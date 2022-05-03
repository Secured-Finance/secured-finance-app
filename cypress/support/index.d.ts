/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Connect Wallet to the application
         * @example
         * cy.connectWallet
         */
        connectWallet(): Chainable<any>;
    }
}
