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
        connectWallet(onBeforeLoad: (win: any) => void): Chainable<any>;
        disconnectWallet(): Chainable<any>;
    }
}
