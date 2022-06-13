import { TenderlyFork } from './tenderlyFork';

export const tenderlyConfig = () => {
    const tenderlyFork = new TenderlyFork(4, Cypress.env('TENDERLY_FORK_ID'));

    before(() => {
        cy.then(async () => {
            await tenderlyFork.init();
        });
    });

    after(() => {
        cy.then(async () => {
            await tenderlyFork.deleteFork();
        });
    });

    before(() => {
        cy.connectWallet(tenderlyFork.onBeforeLoad()).then(() => {
            cy.window().its('ethereum').should('exist');
        });
    });

    after(() => {
        cy.disconnectWallet();
    });
};
